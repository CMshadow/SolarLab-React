import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const RightClickHandler = (props) => {

  const rightClickActions = (event) => {
    props.setRightClickCartesian3(event.position, props.viewer)
    switch (props.uiState) {
      case 'DRAWING_FOUND':
        props.terminateDrawing();
        props.setUIStateFoundDrew();
        props.enableRotate();
        break;

      case 'DRAWING_KEEPOUT':
        props.terminateKeepoutDrawing();
        props.setUIStateEditingKeepout();
        break;

      default:
        const test = props.drawingFoundPolyline.makeSetbackPolylineInside(1);
        props.setDebugPolylines(test)
        break;
    }
  };

  return (
    <ScreenSpaceEvent
      action={(event) => rightClickActions(event)}
      type={Cesium.ScreenSpaceEventType.RIGHT_CLICK}
    />
  );
};

const mapStateToProps = state => {
  return {
    viewer: state.cesiumReducer.viewer,
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    drawingFoundPolyline: state.undoableReducer.present.drawingManagerReducer.drawingPolyline,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enableRotate: () => dispatch(actions.enableRotate()),
    terminateDrawing: () => dispatch(actions.terminateDrawing()),
    terminateKeepoutDrawing: () => dispatch(actions.terminateKeepoutDrawing()),
    setUIStateFoundDrew: () => dispatch(actions.setUIStateFoundDrew()),
    setUIStateEditingKeepout: () => dispatch(actions.setUIStateEditingKeepout()),
    setPreviousUIState: () => dispatch(actions.setPreviousUIState()),
    setRightClickCartesian3: (cartesian, viewer) => dispatch(
      actions.setRightClickCartesian3(cartesian, viewer)
    ),
    setDebugPolylines: (polylines) => dispatch(actions.setDebugPolylines(polylines)),
    setDebugPoints: (points) => dispatch(actions.setDebugPoints(points)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RightClickHandler);
