import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const MouseMoveHandler = (props) => {

  const mouseMoveActions = (event) => {
    props.setMouseCartesian3(event.endPosition, props.viewer);
    const anyPickedObject = props.viewer.scene.pick(event.endPosition);
    const pickedObjectIdArray =
      props.viewer.scene.drillPick(event.endPosition).map(
        elem => elem.id.id
      );

    switch(props.uiState) {
      case 'DRAWING_FOUND':
        props.onDragPolyline(event.endPosition, props.viewer);
        break;

      case 'EDITING_FOUND':
        if (props.pickedPointIndex !== null) {
          // Reposition points on the drawing polyline
          props.movePickedPoint(event.endPosition, props.viewer);
        } else {
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

      case 'EDITING_KEEPOUT':
        if (props.pickedKeepoutPointIndex !== null) {
          // Reposition points on the drawing polyline
          props.moveKeepoutPickedPoint(event.endPosition, props.viewer);
        } else {
          if(anyPickedObject) {
            if (anyPickedObject.id.id === props.drawingKeepoutPolyline.entityId) {
              // Set hover polyline if available
              props.setKeepoutHoverPolyline();
              // Release hover point if it exists
              if (props.hoverKeepoutPointIndex !== null) {
                props.releaseKeepoutHoverPointIndex()};
            }

            // Find out hover on which point
            const onTopPoint = props.drawingKeepoutPolyline.points.find(element => {
              return element.entityId === anyPickedObject.id.id
            })
            // Set hover point if available
            if (onTopPoint) {
              props.setKeepoutHoverPointIndex(onTopPoint);
              // Release hover polyline if it exists
              if (props.hoverKeepoutPolyline) props.releaseKeepoutHoverPolyline();
            }
            // If hover on tree's center point
            else if (
              props.drawingKeepoutPolyline.centerPoint &&
              anyPickedObject.id.id ===
              props.drawingKeepoutPolyline.centerPoint.entityId
            ) {
              props.setKeepoutHoverPointIndex(
                props.drawingKeepoutPolyline.centerPoint
              );
              if (props.hoverKeepoutPolyline) props.releaseKeepoutHoverPolyline();
            }
          } else {
            // Release hover polyline if it exists
            if (props.hoverKeepoutPolyline) props.releaseKeepoutHoverPolyline();
            // Release hover point if it exists
            if (props.hoverKeepoutPointIndex !== null) props.releaseKeepoutHoverPointIndex();
          }
        }
        break;

      case 'EDITING_WIRING':
        if(anyPickedObject) {
          // Find out hover on which point
          const onTopPointPosition =
            anyPickedObject.id.id === props.editingStartPoint.entityId ?
            'START' :
            anyPickedObject.id.id === props.editingEndPoint.entityId ?
            'END' : null

          // Set hover point if available
          if (onTopPointPosition) {
            props.setHoverWiringPoint(onTopPointPosition);
          } else {
            if (props.hoverWiringPointPosition !== null) props.releaseHoverWiringPoint();
          }
        } else {
          // Release hover point if it exists
          if (props.hoverWiringPointPosition !== null) props.releaseHoverWiringPoint();
        }
        break;

      case 'DRAGGING_WIRING':
        const selectConnected = pickedObjectIdArray.reduce((acc, id) => {
          if (props.connectedPanelId.includes(id)) {
            acc.push(id);
            return acc
          } else {
            return acc
          }
        }, [])
        const selectDisconnected = pickedObjectIdArray.reduce((acc, id) => {
          if (props.disconnectedPanelId.includes(id)) {
            acc.push(id);
            return acc
          } else {
            return acc
          }
        }, [])
        if (selectDisconnected.length !== 0) {
          props.setMouseDragStatus(selectDisconnected[0]);
          props.attachPVPanel(selectDisconnected[0]);
        } else if (selectConnected.length !== 0) {
          props.setMouseDragStatus(selectConnected[0]);
          props.releasePVPanel(selectConnected[0]);
        } else {
          props.setMouseDragStatus(null);
        }
        props.dynamicWiringLine();
        break;

      case 'EDITING_ROOFTOP':
        if(anyPickedObject) {
          // Find out hover on which point
          const onTopPoint = props.editingInnerPlanePoints.find(element => {
            return element.entityId === anyPickedObject.id.id
          })
          // Set hover point if available
          if (onTopPoint) {
            if (props.threePointsInfo[props.editingInnerPlaneIndex]) {
              const fixedPointsId = Object.keys(
                props.threePointsInfo[props.editingInnerPlaneIndex]
              ).map(k =>
                props.editingInnerPlanePoints[
                  props.threePointsInfo[props.editingInnerPlaneIndex][k].pointIndex
                ].entityId
              );
              if (!fixedPointsId.includes(onTopPoint.entityId))
                props.setHoverRoofTopPointIndex(onTopPoint);
            } else {
              props.setHoverRoofTopPointIndex(onTopPoint);
            }
          }
        } else {
          if (props.rooftopHoverPoint) props.releaseHoverRoofTopPointIndex();
        }
        break;

      case 'READY_DRAG_INVERTER':
        if(
          anyPickedObject &&
          anyPickedObject.id.id ===
          props.roofSpecInverters[props.editingRoofIndex][props.editingInverterIndex]
          .polygonCenter.entityId
        ) {
          if (props.hoverInverterCenter) {
            props.releaseHoverInverterCenter();
          } else {
            props.setHoverInverterCenter();
          }
        } else {
          if (props.hoverInverterCenter) props.releaseHoverInverterCenter();
        }
        break;

      case 'DRAG_INVERTER':
        props.dragInverter();
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

    drawingKeepoutPolyline:
      state.undoableReducer.present.drawingKeepoutManagerReducer
      .drawingKeepoutPolyline,
    hoverKeepoutPointIndex:
      state.undoableReducer.present.drawingKeepoutManagerReducer
      .hoverPointIndex,
    hoverKeepoutPolyline:
      state.undoableReducer.present.drawingKeepoutManagerReducer
      .hoverPolyline,
    pickedKeepoutPointIndex:
      state.undoableReducer.present.drawingKeepoutManagerReducer
      .pickedPointIndex,

    editingInnerPlaneIndex:
      state.undoableReducer.present.drawingRooftopManagerReducer
      .editingInnerPlaneIndex,
    rooftopHoverPoint:
      state.undoableReducer.present.drawingRooftopManagerReducer.hoverPoint,
    editingInnerPlanePoints:
      state.undoableReducer.present.drawingRooftopManagerReducer
      .editingInnerPlanePoints,
    threePointsInfo:
      state.undoableReducer.present.drawingRooftopManagerReducer
      .threePointsInfo,

    disconnectedPanelId:
      state.undoableReducer.present.editingPVPanelManagerReducer.disconnectedPanelId,
    connectedPanelId:
      state.undoableReducer.present.editingPVPanelManagerReducer.connectedPanelId,
    editingStartPoint:
      state.undoableReducer.present.editingWiringManager.editingStartPoint,
    editingEndPoint:
      state.undoableReducer.present.editingWiringManager.editingEndPoint,
    editingRoofIndex:
      state.undoableReducer.present.editingWiringManager.editingRoofIndex,
    editingInverterIndex:
      state.undoableReducer.present.editingWiringManager.editingInverterIndex,
    hoverWiringPointPosition:
      state.undoableReducer.present.editingWiringManager.hoverWiringPointPosition,
    roofSpecInverters:
      state.undoableReducer.present.editingWiringManager.roofSpecInverters,
    hoverInverterCenter:
      state.undoableReducer.present.editingWiringManager.hoverInverterCenter
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
    setKeepoutHoverPolyline: () => dispatch(actions.setKeepoutHoverPolyline()),
    releaseKeepoutHoverPolyline: () => dispatch(
      actions.releaseKeepoutHoverPolyline()
    ),
    setKeepoutHoverPointIndex: (point) => dispatch(
      actions.setKeepoutHoverPointIndex(point)
    ),
    releaseKeepoutHoverPointIndex: () => dispatch(
      actions.releaseKeepoutHoverPointIndex()
    ),
    moveKeepoutPickedPoint: (cartesian, viewer) => dispatch(
      actions.moveKeepoutPickedPoint(cartesian, viewer)
    ),

    setHoverWiringPoint: (position) => dispatch(
      actions.setHoverWiringPoint(position)
    ),
    releaseHoverWiringPoint: (position) => dispatch(
      actions.releaseHoverWiringPoint(position)
    ),
    dynamicWiringLine: () => dispatch(
      actions.dynamicWiringLine()
    ),
    attachPVPanel: (panelId) => dispatch(actions.attachPVPanel(panelId)),
    releasePVPanel: (panelId) => dispatch(actions.releasePVPanel(panelId)),
    setMouseDragStatus: (obj) => dispatch(actions.setMouseDragStatus(obj)),

    setHoverRoofTopPointIndex: (point) => dispatch(
      actions.setHoverRoofTopPointIndex(point)
    ),
    releaseHoverRoofTopPointIndex: (point) => dispatch(
      actions.releaseHoverRoofTopPointIndex(point)
    ),
    releaseHoverInverterCenter: () => dispatch(
      actions.releaseHoverInverterCenter()
    ),
    setHoverInverterCenter: () => dispatch(
      actions.setHoverInverterCenter()
    ),
    dragInverter: () => dispatch(actions.dragInverter())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MouseMoveHandler);
