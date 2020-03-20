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

      case 'DRAW_MAIN_BRIDGING':
        props.terminateDrawMainBridging();
        props.setUIStateSetUpBridging();
        break;

      default:
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
    viewer:
      state.undoable.present.cesiumManager.viewer,
    uiState:
      state.undoable.present.uiStateManager.uiState,
    drawingFoundPolyline:
      state.undoable.present.drawingManager.drawingPolyline,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enableRotate: () => dispatch(actions.enableRotate()),
    terminateDrawing: () => dispatch(actions.terminateDrawing()),
    terminateKeepoutDrawing: () => dispatch(actions.terminateKeepoutDrawing()),
    setUIStateFoundDrew: () => dispatch(actions.setUIStateFoundDrew()),
    setUIStateEditingKeepout: () => dispatch(actions.setUIStateEditingKeepout()),
    setUIStateSetUpBridging: () => dispatch(actions.setUIStateSetUpBridging()),
    setPreviousUIState: () => dispatch(actions.setPreviousUIState()),
    setRightClickCartesian3: (cartesian, viewer) => dispatch(
      actions.setRightClickCartesian3(cartesian, viewer)
    ),
    terminateDrawMainBridging: () => dispatch(
      actions.terminateDrawMainBridging()
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RightClickHandler);
