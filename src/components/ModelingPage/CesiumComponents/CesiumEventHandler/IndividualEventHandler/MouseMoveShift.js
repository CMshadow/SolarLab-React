import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const MouseMoveShiftHandler = (props) => {

  const mouseMoveActions = (event) => {
    props.setMouseCartesian3(event.endPosition, props.viewer);
    switch(props.uiState) {
      case 'DRAWING_FOUND':
        props.dragPolylineFixedMode(event.endPosition, props.viewer);
        break;

      default:
        break;
    }
  };


  return (
    <ScreenSpaceEvent
      action={(event) => mouseMoveActions(event)}
      type={Cesium.ScreenSpaceEventType.MOUSE_MOVE}
      modifier={Cesium.KeyboardEventModifier.SHIFT}
    />
  );
};

const mapStateToProps = state => {
  return {
    viewer: state.cesiumReducer.viewer,
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dragPolylineFixedMode: (cartesian, viewer) => dispatch(
      actions.dragPolylineFixedMode(cartesian, viewer)
    ),
    setMouseCartesian3: (cartesian, viewer) => dispatch(
      actions.setMouseCartesian3(cartesian, viewer)
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MouseMoveShiftHandler);
