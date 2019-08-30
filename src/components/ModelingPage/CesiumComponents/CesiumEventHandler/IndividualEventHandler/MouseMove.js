import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const RightClickHandler = (props) => {

  const mouseMoveActions = (event) => {
    props.setMouseCartesian3(event.endPosition, props.viewer);
    if (props.uiStartDrawing) {
      props.onDragPolyline(event.endPosition, props.viewer);
    } else if (props.uiState === 'FOUND_DREW' && props.pickedPoint) {
      // Reposition points on the drawing polyline
      props.movePickedPoint(event.endPosition, props.viewer);
    }
    else {
      const anyPickedObject = props.viewer.scene.pick(event.endPosition);

      if(anyPickedObject) {
        if (anyPickedObject.id.id === props.drawingPolyline.entityId) {
          // Set hover polyline if available
          props.setHoverPolyline();
          // Release hover point if it exists
          if (props.hoverPoint) props.releaseHoverPoint();
        }

        // Find out hover on which point
        const onTopPoint  = props.drawingPolyline.points.find(element => {
          return element.entityId === anyPickedObject.id.id
        })
        // Set hover point if available
        if (onTopPoint) {
          props.setHoverPoint(onTopPoint);
          // Release hover polyline if it exists
          if (props.hoverPolyline) props.releaseHoverPolyline();
        }
      } else {
        // Release hover polyline if it exists
        if (props.hoverPolyline) props.releaseHoverPolyline();
        // Release hover point if it exists
        if (props.hoverPoint) props.releaseHoverPoint();
      }
    }
  };


  return (
    <ScreenSpaceEvent
      action={(event) => mouseMoveActions(event)}
      type={Cesium.ScreenSpaceEventType.MOUSE_MOVE}
    />
  );
};

const mapStateToProps = state => {
  return {
    viewer: state.cesiumReducer.viewer,
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    uiStartDrawing: state.undoableReducer.present.uiStateManagerReducer.uiStartDrawing,
    drawingPolyline: state.undoableReducer.present.drawingManagerReducer.drawingPolyline,
    hoverPolyline: state.undoableReducer.present.drawingManagerReducer.hoverPolyline,
    hoverPoint: state.undoableReducer.present.drawingManagerReducer.hoverPoint,
    pickedPoint: state.undoableReducer.present.drawingManagerReducer.pickedPoint,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDragPolyline: (cartesian, viewer) => dispatch(
      actions.dragPolyline(cartesian, viewer)
    ),
    setHoverPolyline: () => dispatch(actions.setHoverPolyline()),
    releaseHoverPolyline: () => dispatch(actions.releaseHoverPolyline()),
    setHoverPoint: (point) => dispatch(actions.setHoverPoint(point)),
    releaseHoverPoint: () => dispatch(actions.releaseHoverPoint()),
    movePickedPoint: (cartesian, viewer) => dispatch(
      actions.movePickedPoint(cartesian, viewer)
    ),
    setMouseCartesian3: (cartesian, viewer) => dispatch(
      actions.setMouseCartesian3(cartesian, viewer)
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RightClickHandler);
