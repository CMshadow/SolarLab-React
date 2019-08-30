import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const LeftUpHandler = (props) => {

  const leftUpActions = (event) => {
    if (props.uiState === 'FOUND_DREW') {
      if (props.pickedPoint) {
        props.releasePickedPoint();
        props.enableRotate();
      }
    }
  };

  return (
    <ScreenSpaceEvent
      action={(event) => leftUpActions(event)}
      type={Cesium.ScreenSpaceEventType.LEFT_UP}
    />
  );
};

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    pickedPoint: state.undoableReducer.present.drawingManagerReducer.pickedPoint,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enableRotate: () => dispatch(actions.enableRotate()),
    releasePickedPoint: (point) => dispatch(actions.releasePickedPoint(point)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftUpHandler);
