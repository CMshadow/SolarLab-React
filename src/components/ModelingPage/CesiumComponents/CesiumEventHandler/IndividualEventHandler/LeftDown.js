import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const LeftDownHandler = (props) => {

  const leftDownActions = (event) => {
    const pickedObject = props.viewer.scene.pick(event.position)
    switch (props.uiState) {
      case 'EDITING_FOUND':
        if (pickedObject) {
          // Find out picked which point
          const onTopPoint = props.drawingPolyline.points.find(element =>
            element.entityId === pickedObject.id.id
          )
          // Set picked point if available
          if (onTopPoint) {
            props.setPickedPointIndex(onTopPoint);
          }
        }
        break;

      case 'EDITING_KEEPOUT':
        props.disableRotate();
        if (pickedObject) {
          // Find out picked which point
          const onTopPoint = props.drawingKeepoutPolyline.points.find(element =>
            element.entityId === pickedObject.id.id
          )
          // Set picked point if available
          if (onTopPoint) {
            props.setKeepoutPickedPointIndex(onTopPoint);
          }
        }
        break;
      default:
        break;
    }
  };

  return (
    <ScreenSpaceEvent
      action={(event) => leftDownActions(event)}
      type={Cesium.ScreenSpaceEventType.LEFT_DOWN}
    />
  );
};

const mapStateToProps = state => {
  return {
    viewer: state.cesiumReducer.viewer,
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,

    drawingPolyline:
      state.undoableReducer.present.drawingManagerReducer.drawingPolyline,
    drawingKeepoutPolyline:
      state.undoableReducer.present.drawingKeepoutManagerReducer
      .drawingKeepoutPolyline,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    disableRotate: (point) => dispatch(actions.disableRotate(point)),
    setPickedPointIndex: (point) => dispatch(actions.setPickedPointIndex(point)),
    setKeepoutPickedPointIndex: (point) => dispatch(
      actions.setKeepoutPickedPointIndex(point)
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftDownHandler);
