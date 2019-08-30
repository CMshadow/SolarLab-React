import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const LeftDownHandler = (props) => {

  const leftDownActions = (event) => {
    if (props.uiState === 'EDITING_FOUND') {
      if (props.viewer.scene.pick(event.position)) {
        // Find out picked which point
        const onTopPoint = props.drawingPolyline.points.find(element => {
          return (
            element.entityId === props.viewer.scene.pick(event.position).id.id
          )
        })
        // Set picked point if available
        if (onTopPoint) {
          props.setPickedPointIndex(onTopPoint);
        }
      }
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
    drawingPolyline: state.undoableReducer.present.drawingManagerReducer.drawingPolyline,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPickedPointIndex: (point) => dispatch(actions.setPickedPointIndex(point)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftDownHandler);
