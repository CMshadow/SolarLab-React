import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const LeftUpHandler = (props) => {

  const leftUpActions = (event) => {
    switch (props.uiState) {
      case 'EDITING_FOUND':
        if (props.pickedPointIndex !== null) {
          props.releasePickedPointIndex();
        }
        break;

      case 'EDITING_KEEPOUT':
        if (props.pickedKeepoutPointIndex !== null) {
          props.releaseKeepoutPickedPointIndex();
        }
        break;

      case 'DRAGGING_WIRING':
        if (props.pickedWiringPointPosition) {
          props.releasePickedWiringPoint();
          props.enableRotate();
          props.setUIStateEditingWiring();
        }
        break;

      default:
        break;
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
    pickedPointIndex:
      state.undoableReducer.present.drawingManagerReducer.pickedPointIndex,
    pickedKeepoutPointIndex:
      state.undoableReducer.present.drawingKeepoutManagerReducer
      .pickedPointIndex,
    pickedWiringPointPosition:
      state.undoableReducer.present.editingWiringManager.pickedWiringPointPosition,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enableRotate: () => dispatch(actions.enableRotate()),
    releasePickedPointIndex: (point) => dispatch(
      actions.releasePickedPointIndex(point)
    ),
    releaseKeepoutPickedPointIndex: (point) => dispatch(
      actions.releaseKeepoutPickedPointIndex(point)
    ),

    releasePickedWiringPoint: () => dispatch(
      actions.releasePickedWiringPoint()
    ),
    setUIStateEditingWiring: () => dispatch(actions.setUIStateEditingWiring())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftUpHandler);
