import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const MouseMoveHandler = (props) => {

  const mouseMoveActions = (event) => {
    props.setMouseCartesian3(event.endPosition, props.viewer);
    switch(props.uiState) {
      case 'DRAWING_FOUND':
        props.onDragPolyline(event.endPosition, props.viewer);
        break;

      case 'EDITING_FOUND':
        if (props.pickedPointIndex !== null) {
          // Reposition points on the drawing polyline
          props.movePickedPoint(event.endPosition, props.viewer);
        } else {
          const anyPickedObject = props.viewer.scene.pick(event.endPosition);
          if(anyPickedObject) {
            if (anyPickedObject.id.id === props.drawingPolyline.entityId) {
              // Set hover polyline if available
              props.setHoverPolyline();
              // Release hover point if it exists
              if (props.hoverPointIndex !== null) {
                props.releaseHoverPointIndex()};
            }

            // Find out hover on which point
            const onTopPoint = props.drawingPolyline.points.find(element => {
              return element.entityId === anyPickedObject.id.id
            })
            // Set hover point if available
            if (onTopPoint) {
              props.setHoverPointIndex(onTopPoint);
              // Release hover polyline if it exists
              if (props.hoverPolyline) props.releaseHoverPolyline();
            }
          } else {
            // Release hover polyline if it exists
            if (props.hoverPolyline) props.releaseHoverPolyline();
            // Release hover point if it exists
            if (props.hoverPointIndex !== null) props.releaseHoverPointIndex();
          }
        }
        break;

      case 'DRAWING_INNER':
        const pickedObjectIdArray =
          props.viewer.scene.drillPick(event.endPosition).map(
            elem => elem.id.id
          );

        if (
          pickedObjectIdArray.includes(props.drawingPolyline.entityId) &&
          props.hoverInnerPointId === null &&
          props.hoverInnerLineIndex === null
        ) {
          // Set hover foundation polyline if available
          props.setHoverPolyline();
        } else {
          // Release hover foundation polyline
          if (props.hoverPolyline) props.releaseHoverPolyline();
        }

        const mouseOnInnerPoint = Object.keys(props.pointsRelation)
        .find(element => {
          return pickedObjectIdArray.includes(element);
        })
        if (mouseOnInnerPoint) {
          props.setHoverInnerPoint(mouseOnInnerPoint);
        } else {
          if (props.hoverInnerPointId) props.releaseHoverInnerPoint();
        }

        const mouseOnInnerLine = props.fixedInnerPolylines.find(element => {
          return pickedObjectIdArray.includes(element.entityId);
        })
        if (
          mouseOnInnerLine &&
          props.hoverInnerPointId === null
        ) {
          props.setHoverInnerLine(mouseOnInnerLine);
        } else {
          if (props.hoverInnerLineIndex !== null) props.releaseHoverInnerLine();
        }

        if (props.drawingInnerPolyline) {
          props.dragDrawingInnerPolyline(event.endPosition, props.viewer);
        }
        break;

      case 'DRAWING_KEEPOUT':
        props.dragKeepoutPolyline(event.endPosition, props.viewer);
        break;

      default:
        break;
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
    drawingPolyline:
      state.undoableReducer.present.drawingManagerReducer.drawingPolyline,
    hoverPolyline:
      state.undoableReducer.present.drawingManagerReducer.hoverPolyline,
    hoverPointIndex:
      state.undoableReducer.present.drawingManagerReducer.hoverPointIndex,
    pickedPointIndex:
      state.undoableReducer.present.drawingManagerReducer.pickedPointIndex,

    pointsRelation:
      state.undoableReducer.present.drawingInnerManagerReducer.pointsRelation,
    drawingInnerPolyline:
      state.undoableReducer.present.drawingInnerManagerReducer
      .drawingInnerPolyline,
    fixedInnerPolylines:
      state.undoableReducer.present.drawingInnerManagerReducer
      .fixedInnerPolylines,
    hoverInnerLineIndex:
      state.undoableReducer.present.drawingInnerManagerReducer
      .hoverInnerLineIndex,
    hoverInnerPointId:
      state.undoableReducer.present.drawingInnerManagerReducer
      .hoverInnerPointId,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDragPolyline: (cartesian, viewer) => dispatch(
      actions.dragPolyline(cartesian, viewer)
    ),
    setHoverPolyline: () => dispatch(actions.setHoverPolyline()),
    releaseHoverPolyline: () => dispatch(actions.releaseHoverPolyline()),
    setHoverPointIndex: (point) => dispatch(actions.setHoverPointIndex(point)),
    releaseHoverPointIndex: () => dispatch(actions.releaseHoverPointIndex()),
    movePickedPoint: (cartesian, viewer) => dispatch(
      actions.movePickedPoint(cartesian, viewer)
    ),
    setMouseCartesian3: (cartesian, viewer) => dispatch(
      actions.setMouseCartesian3(cartesian, viewer)
    ),

    dragDrawingInnerPolyline: (cartesian, viewer) => dispatch(
      actions.dragDrawingInnerPolyline(cartesian, viewer)
    ),
    setHoverInnerLine: (inner) => dispatch(actions.setHoverInnerLine(inner)),
    releaseHoverInnerLine: () => dispatch(actions.releaseHoverInnerLine()),
    setHoverInnerPoint: (point) => dispatch(actions.setHoverInnerPoint(point)),
    releaseHoverInnerPoint: () => dispatch(actions.releaseHoverInnerPoint()),

    dragKeepoutPolyline: (cartesian, viewer) => dispatch(
      actions.dragKeepoutPolyline(cartesian, viewer)
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MouseMoveHandler);
