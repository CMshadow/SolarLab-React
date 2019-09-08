import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const LeftUpHandler = (props) => {

  const leftUpActions = (event) => {
    if (props.uiState === 'EDITING_FOUND') {
      if (props.pickedPointIndex !== null) {
        props.releasePickedPointIndex();
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
    pickedPointIndex: state.undoableReducer.present.drawingManagerReducer.pickedPointIndex,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    releasePickedPointIndex: (point) => dispatch(actions.releasePickedPointIndex(point)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftUpHandler);
