import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const LeftClickHandler = (props) => {

  const leftClickActions = (event) => {
    switch (props.uiState) {
      case 'DRAWING_FOUND':
        const pickedObjectIdArray =
          props.viewer.scene.drillPick(event.position).map(
            elem => elem.id.id
          );
        if (
          pickedObjectIdArray.includes(props.drawingPolyline.points[0].entityId)
        ) {
          console.log('herhe')
          props.terminateDrawing();
          props.setUIStateFoundDrew();
          props.enableRotate();
        } else {
          props.disableRotate();
          props.addPointOnPolyline(event.position, props.viewer);
        }
        break;

      case 'DRAWING_INNER':
        const PickedObjectsArray = props.viewer.scene.drillPick(event.position);
        props.disableRotate();
        props.addOrClickPoint(event.position, props.viewer, PickedObjectsArray);
        if (props.hoverPolyline) {
          props.releaseHoverPolyline();
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
    drawingPolyline:
      state.undoableReducer.present.drawingManagerReducer.drawingPolyline,
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
    releaseHoverPolyline: () => dispatch(actions.releaseHoverPolyline()),
    addPointOnPolyline: (cartesian, viewer) => dispatch(
      actions.addPointOnPolyline(cartesian, viewer)
    ),
    addOrClickPoint: (cartesian, viewer, pickedObject) => dispatch(
      actions.addOrClickPoint(cartesian, viewer, pickedObject)
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftClickHandler);
