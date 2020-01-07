import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const LeftClickShiftHandler = (props) => {

  const leftClickActions = (event) => {
    const PickedObjectsArray = props.viewer.scene.drillPick(event.position);
    const pickedObjectIdArray = PickedObjectsArray.map(elem => elem.id.id);

    switch (props.uiState) {
      case 'DRAWING_FOUND':
        if (
          pickedObjectIdArray.includes(props.drawingFoundPolyline.points[0].entityId)
        ) {
          props.terminateDrawing();
          props.setUIStateFoundDrew();
          props.enableRotate();
        } else if (
          props.drawingFoundPolyline.points.slice(1,).map(p => p.entityId)
          .reduce((include, id) => {
            include = pickedObjectIdArray.includes(id) ? true : include;
            return include;
          }, false)
        ) {
          break;
        } else {
          props.disableRotate();
          props.addPointOnPolyline(event.position, props.viewer, true);
        }
        break;

      case 'DRAWING_INNER':
        const PickedObjectsArray = props.viewer.scene.drillPick(event.position);
        props.disableRotate();
        props.addOrClickPoint(event.position, props.viewer, PickedObjectsArray);
        break;

      case 'DRAWING_KEEPOUT':
        switch (props.linkedKeepoutType) {
          default:
          case 'ENV':
          case 'KEEPOUT':
          case 'PASSAGE':
            if (
              pickedObjectIdArray.includes(
                props.drawingKeepoutPolyline.points[0].entityId
              )
            ) {
              props.terminateKeepoutDrawing();
              props.setUIStateEditingKeepout();
            } else if (
              props.drawingKeepoutPolyline.points.slice(1,).map(p => p.entityId)
              .reduce((include, id) => {
                include = pickedObjectIdArray.includes(id) ? true : include;
                return include;
              }, false)
            ) {
              break;
            } else {
              props.disableRotate();
              props.addPointOnKeepoutPolyline(event.position, props.viewer, true);
            }
            break;
        }
        break;

      default:
        break;
    }
  };

  return (
    <ScreenSpaceEvent
      action={(event) => leftClickActions(event)}
      type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
      modifier={Cesium.KeyboardEventModifier.SHIFT}
    />
  );
};

const mapStateToProps = state => {
  return {
    viewer: state.cesiumReducer.viewer,
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    drawingFoundPolyline:
      state.undoableReducer.present.drawingManagerReducer.drawingPolyline,
    drawingKeepoutPolyline:
      state.undoableReducer.present.drawingKeepoutManagerReducer
      .drawingKeepoutPolyline,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    disableRotate: () => dispatch(actions.disableRotate()),
    enableRotate: () => dispatch(actions.enableRotate()),
    setUIStateFoundDrew: () => dispatch(actions.setUIStateFoundDrew()),
    setUIStateEditingKeepout: () => dispatch(actions.setUIStateEditingKeepout()),
    addPointOnPolyline: (cartesian, viewer, fixedMode) => dispatch(
      actions.addPointOnPolyline(cartesian, viewer, fixedMode)
    ),
    addPointOnKeepoutPolyline: (cartesian, viewer, fixedMode) => dispatch(
      actions.addPointOnKeepoutPolyline(cartesian, viewer, fixedMode)
    ),
    addOrClickPoint: (cartesian, viewer, pickedObject) => dispatch(
      actions.addOrClickPoint(cartesian, viewer, pickedObject)
    ),
    terminateDrawing: () => dispatch(actions.terminateDrawing()),
    terminateKeepoutDrawing: () => dispatch(actions.terminateKeepoutDrawing()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftClickShiftHandler);
