import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const RightClickHandler = (props) => {

  const rightClickActions = (event) => {
    props.setRightClickCartesian3(event.position, props.viewer)
    if (props.uiState === 'DRAWING_FOUND') {
      props.terminateDrawing();
      props.setUIStateFoundDrew();
      props.enableRotate();
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enableRotate: () => dispatch(actions.enableRotate()),
    terminateDrawing: () => dispatch(actions.terminateDrawing()),
    setUIStateFoundDrew: () => dispatch(actions.setUIStateFoundDrew()),
    setRightClickCartesian3: (cartesian, viewer) => dispatch(
      actions.setRightClickCartesian3(cartesian, viewer)
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RightClickHandler);