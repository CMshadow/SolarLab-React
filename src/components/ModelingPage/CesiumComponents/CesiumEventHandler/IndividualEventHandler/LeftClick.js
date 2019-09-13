import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const LeftClickHandler = (props) => {

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
        } else {
          props.disableRotate();
          props.addPointOnPolyline(event.position, props.viewer);
        }
        break;

      case 'DRAWING_INNER':
        props.disableRotate();
        props.addOrClickPoint(event.position, props.viewer, PickedObjectsArray);
        if (props.hoverPolyline) {
          props.releaseHoverPolyline();
        }
        break;

      case 'DRAWING_KEEPOUT':
        if (
          pickedObjectIdArray.includes(props.drawingKeepoutPolyline.points[0].entityId)
        ) {
          props.terminateKeepoutDrawing();
        } else {
          props.disableRotate();
          props.addPointOnKeepoutPolyline(event.position, props.viewer);
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
    hoverPolyline:
      state.undoableReducer.present.drawingManagerReducer.hoverPolyline,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    disableRotate: () => dispatch(actions.disableRotate()),
    enableRotate: () => dispatch(actions.enableRotate()),
    setUIStateFoundDrew: () => dispatch(actions.setUIStateFoundDrew()),
    terminateDrawing: () => dispatch(actions.terminateDrawing()),
    terminateKeepoutDrawing: () => dispatch(actions.terminateKeepoutDrawing()),
    releaseHoverPolyline: () => dispatch(actions.releaseHoverPolyline()),
    addPointOnKeepoutPolyline: (cartesian, viewer) => dispatch(
      actions.addPointOnKeepoutPolyline(cartesian, viewer)
    ),
    addOrClickPoint: (cartesian, viewer, pickedObject) => dispatch(
      actions.addOrClickPoint(cartesian, viewer, pickedObject)
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftClickHandler);
