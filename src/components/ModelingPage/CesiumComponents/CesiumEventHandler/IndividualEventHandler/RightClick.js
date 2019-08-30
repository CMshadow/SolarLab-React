import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const RightClickHandler = (props) => {

  const rightClickActions = (event) => {
    if (props.uiStartDrawing) {
      props.terminateDrawing();
      props.setUIStateFoundDrew();
      props.enableRotate();
      props.setStopDrawing();
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
    uiStartDrawing: state.undoableReducer.present.uiStateManagerReducer.uiStartDrawing,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enableRotate: () => dispatch(actions.enableRotate()),
    terminateDrawing: () => dispatch(actions.terminateDrawing()),
    setUIStateFoundDrew: () => dispatch(actions.setUIStateFoundDrew()),
    setStopDrawing: () => dispatch(actions.stopDrawing()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RightClickHandler);
