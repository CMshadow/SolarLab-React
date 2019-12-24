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
        if (pickedObject) {
          props.disableRotate();
          // Find out picked which point
          const onTopPoint = props.drawingKeepoutPolyline.points.find(element =>
            element.entityId === pickedObject.id.id
          )
          // Set picked point if available
          if (onTopPoint) {
            props.setKeepoutPickedPointIndex(onTopPoint);
          } else if (
            props.drawingKeepoutPolyline.centerPoint &&
            pickedObject.id.id ===
            props.drawingKeepoutPolyline.centerPoint.entityId
          ) {
            props.setKeepoutPickedPointIndex(
              props.drawingKeepoutPolyline.centerPoint
            );
          }
        }
        break;

      case 'MANUAL_WIRING':
        if (pickedObject) {
          if (props.disconnectedPanelId.includes(pickedObject.id.id)) {
            props.disableRotate();
            props.setManualWiringStart(pickedObject.id.id);
            props.setUIStateDraggingWiring();
          }
        }
        break;

      case 'EDITING_WIRING':
        if (pickedObject) {
          // Find out picked which point
          const onTopPointPosition =
            pickedObject.id.id === props.editingStartPoint.entityId ?
            'START' :
            pickedObject.id.id === props.editingEndPoint.entityId ?
            'END' : null
          // Set picked point if available
          if (onTopPointPosition) {
            props.disableRotate();
            props.setPickedWiringPoint();
            props.setUIStateDraggingWiring();
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

    editingStartPoint:
      state.undoableReducer.present.editingWiringManager.editingStartPoint,
    editingEndPoint:
      state.undoableReducer.present.editingWiringManager.editingEndPoint,
    disconnectedPanelId:
      state.undoableReducer.present.editingPVPanelManagerReducer
      .disconnectedPanelId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    disableRotate: (point) => dispatch(actions.disableRotate(point)),
    setPickedPointIndex: (point) => dispatch(actions.setPickedPointIndex(point)),
    setKeepoutPickedPointIndex: (point) => dispatch(
      actions.setKeepoutPickedPointIndex(point)
    ),
    setPickedWiringPoint: () => dispatch(
      actions.setPickedWiringPoint()
    ),
    setUIStateEditingWiring: () => dispatch(actions.setUIStateEditingWiring()),
    setUIStateDraggingWiring: () => dispatch(actions.setUIStateDraggingWiring()),
    setManualWiringStart: (panelId) => dispatch(
      actions.setManualWiringStart(panelId)
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftDownHandler);
