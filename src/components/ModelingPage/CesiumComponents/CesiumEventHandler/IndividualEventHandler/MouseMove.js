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
            if (anyPickedObject.id.id === props.drawingKeepoutPolyline.entityId)
            {
              // Set hover polyline if available
              props.setKeepoutHoverPolyline();
              // Release hover point if it exists
              if (props.hoverKeepoutPointIndex !== null) {
                props.releaseKeepoutHoverPointIndex()};
            }

            // Find out hover on which point
            const onTopPoint = props.drawingKeepoutPolyline.points.find(
              element => {
              return element.entityId === anyPickedObject.id.id
            })
            // Set hover point if available
            if (onTopPoint) {
              props.setKeepoutHoverPointIndex(onTopPoint);
              // Release hover polyline if it exists
              if (props.hoverKeepoutPolyline) {
                props.releaseKeepoutHoverPolyline();
              }
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
              if (props.hoverKeepoutPolyline) {
                props.releaseKeepoutHoverPolyline();
              }
            }
          } else {
            // Release hover polyline if it exists
            if (props.hoverKeepoutPolyline) {
              props.releaseKeepoutHoverPolyline();
            }
            // Release hover point if it exists
            if (props.hoverKeepoutPointIndex !== null) {
              props.releaseKeepoutHoverPointIndex();
            }
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
            if (props.hoverWiringPointPosition !== null) {
              props.releaseHoverWiringPoint();
            }
          }
        } else {
          // Release hover point if it exists
          if (props.hoverWiringPointPosition !== null) {
            props.releaseHoverWiringPoint();
          }
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
                  props.threePointsInfo[props.editingInnerPlaneIndex][k]
                  .pointIndex
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
          props.entireSpecInverters[props.editingInverterIndex]
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

      case 'DRAW_MAIN_BRIDGING':
        props.dynamicMainBridging();
        break;

      case 'EDIT_BRIDGING':
        if (anyPickedObject) {
          const allBridgingPointIds =
            props.entireSpecInverters[props.editingRoofIndex][
            props.editingInverterIndex].bridging.flatMap(bridging =>
              bridging.mainPolyline.points.slice(1,)
            ).map(p => p.entityId);
          const allBridgingMainPolylineIds =
            props.entireSpecInverters[props.editingRoofIndex][
            props.editingInverterIndex].bridging.map(bridging =>
              bridging.mainPolyline.entityId
            );
          if (allBridgingPointIds.includes(anyPickedObject.id.id)) {
            props.setHoverBridgingPoint(anyPickedObject.id.id);
            if (props.editingBridgingMainPolylineIndex !== null)
              props.releaseHoverBridgingMainPolyline();
          } else if (allBridgingMainPolylineIds.includes(anyPickedObject.id.id))
          {
            props.setHoverBridgingMainPolyline(anyPickedObject.id.id);
            if (props.editingBridgingPointIndex !== null)
              props.releaseHoverBridgingPoint();
          } else {
            if (props.editingBridgingPointIndex !== null)
              props.releaseHoverBridgingPoint();
            if (props.editingBridgingMainPolylineIndex !== null)
              props.releaseHoverBridgingMainPolyline();
          }
        } else {
          if (props.editingBridgingPointIndex !== null)
            props.releaseHoverBridgingPoint();
          if (props.editingBridgingMainPolylineIndex !== null)
            props.releaseHoverBridgingMainPolyline();
        }
        break;

      case 'DRAG_BRIDGING':
        if (props.editingBridgingPointIndex !== null) {
          props.dragBridgingPoint()
        }
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
    viewer:
      state.undoable.present.cesiumManager.viewer,
    uiState:
      state.undoable.present.uiStateManager.uiState,

    drawingPolyline:
      state.undoable.present.drawingManager.drawingPolyline,
    hoverPolyline:
      state.undoable.present.drawingManager.hoverPolyline,
    hoverPointIndex:
      state.undoable.present.drawingManager.hoverPointIndex,
    pickedPointIndex:
      state.undoable.present.drawingManager.pickedPointIndex,

    pointsRelation:
      state.undoable.present.drawingInnerManager.pointsRelation,
    drawingInnerPolyline:
      state.undoable.present.drawingInnerManager.drawingInnerPolyline,
    fixedInnerPolylines:
      state.undoable.present.drawingInnerManager.fixedInnerPolylines,
    hoverInnerLineIndex:
      state.undoable.present.drawingInnerManager.hoverInnerLineIndex,
    hoverInnerPointId:
      state.undoable.present.drawingInnerManager.hoverInnerPointId,

    drawingKeepoutPolyline:
      state.undoable.present.drawingKeepoutManager.drawingKeepoutPolyline,
    hoverKeepoutPointIndex:
      state.undoable.present.drawingKeepoutManager.hoverPointIndex,
    hoverKeepoutPolyline:
      state.undoable.present.drawingKeepoutManager.hoverPolyline,
    pickedKeepoutPointIndex:
      state.undoable.present.drawingKeepoutManager.pickedPointIndex,

    editingInnerPlaneIndex:
      state.undoable.present.drawingRooftopManager.editingInnerPlaneIndex,
    rooftopHoverPoint:
      state.undoable.present.drawingRooftopManager.hoverPoint,
    editingInnerPlanePoints:
      state.undoable.present.drawingRooftopManager.editingInnerPlanePoints,
    threePointsInfo:
      state.undoable.present.drawingRooftopManager.threePointsInfo,

    disconnectedPanelId:
      state.undoable.present.editingPVPanelManager.disconnectedPanelId,
    connectedPanelId:
      state.undoable.present.editingPVPanelManager.connectedPanelId,
    editingStartPoint:
      state.undoable.present.editingWiringManager.editingStartPoint,
    editingEndPoint:
      state.undoable.present.editingWiringManager.editingEndPoint,
    editingRoofIndex:
      state.undoable.present.editingWiringManager.editingRoofIndex,
    editingInverterIndex:
      state.undoable.present.editingWiringManager.editingInverterIndex,
    hoverWiringPointPosition:
      state.undoable.present.editingWiringManager.hoverWiringPointPosition,
    entireSpecInverters:
      state.undoable.present.editingWiringManager.entireSpecInverters,
    hoverInverterCenter:
      state.undoable.present.editingWiringManager.hoverInverterCenter,
    editingBridgingPointIndex:
      state.undoable.present.editingWiringManager.editingBridgingPointIndex,
    editingBridgingMainPolylineIndex:
      state.undoable.present.editingWiringManager
      .editingBridgingMainPolylineIndex
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
    dragInverter: () => dispatch(actions.dragInverter()),
    dynamicMainBridging: () => dispatch(actions.dynamicMainBridging()),
    setHoverBridgingPoint: (pointId) => dispatch(
      actions.setHoverBridgingPoint(pointId)
    ),
    releaseHoverBridgingPoint: () => dispatch(
      actions.releaseHoverBridgingPoint()
    ),
    dragBridgingPoint: () => dispatch(
      actions.dragBridgingPoint()
    ),
    setHoverBridgingMainPolyline: (polylineId) => dispatch(
      actions.setHoverBridgingMainPolyline(polylineId)
    ),
    releaseHoverBridgingMainPolyline: () => dispatch(
      actions.releaseHoverBridgingMainPolyline()
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MouseMoveHandler);
