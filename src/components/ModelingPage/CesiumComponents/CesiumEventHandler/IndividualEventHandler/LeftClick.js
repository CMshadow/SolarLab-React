import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const LeftClickHandler = (props) => {

  const leftClickActions = (event) => {
    const PickedObjectsArray = props.viewer.scene.drillPick(event.position);
    const pickedObjectIdArray = PickedObjectsArray.map(elem => elem.id.id);

    switch (props.uiState) {

      case 'DRAWING_FOUND':
        if (
          pickedObjectIdArray.includes(props.drawingFoundPolyline.points[0].entityId)
        ) {
          props.terminateDrawing();
          props.setUIStateFoundDrew();
          props.enableRotate();
        } else {
          props.disableRotate();
          props.addPointOnPolyline(event.position, props.viewer);
        }
        break;

      case 'DRAWING_INNER':
        props.disableRotate();
        props.addOrClickPoint(event.position, props.viewer, PickedObjectsArray);
        if (props.hoverPolyline) {
          props.releaseHoverPolyline();
        }
        break;

      case 'DRAWING_KEEPOUT':
        switch (props.linkedKeepoutType) {
          default:
          case 'ENV':
          case 'KEEPOUT':
          case 'PASSAGE':
            if (
              pickedObjectIdArray.includes(
                props.drawingKeepoutPolyline.points[0].entityId
              )
            ) {
              props.terminateKeepoutDrawing();
              props.setUIStateEditingKeepout();
            } else {
              props.disableRotate();
              props.addPointOnKeepoutPolyline(event.position, props.viewer);
            }
            break;

          case 'VENT':
            props.addVentTemplate(event.position, props.viewer);
            props.setUIStateEditingKeepout();
            break;

          case 'TREE':
            props.addTreeTemplate(event.position, props.viewer);
            props.setUIStateEditingKeepout();
        }
        break;

      case 'EDITING_ROOFTOP':
        if (pickedObjectIdArray.includes(props.rooftopHoverPoint.entityId)) {
          props.setPickedRoofTopPointIndex();
        }
        break;

      case 'PLACE_INVERTER':
        props.placeInverter();
        props.setUIStateSetUpBridging();
        break;

      default:
        break;
    }
  };

  return (
    <ScreenSpaceEvent
      action={(event) => leftClickActions(event)}
      type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
    />
  );
};

const mapStateToProps = state => {
  return {
    viewer: state.cesiumReducer.viewer,
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    drawingFoundPolyline:
      state.undoableReducer.present.drawingManagerReducer.drawingPolyline,
    hoverPolyline:
      state.undoableReducer.present.drawingManagerReducer.hoverPolyline,

    drawingKeepoutPolyline:
      state.undoableReducer.present.drawingKeepoutManagerReducer
      .drawingKeepoutPolyline,
    linkedKeepoutType:
      state.undoableReducer.present.drawingKeepoutManagerReducer
      .linkedKeepoutType,
    rooftopHoverPoint:
      state.undoableReducer.present.drawingRooftopManagerReducer.hoverPoint
  };
};

const mapDispatchToProps = dispatch => {
  return {
    disableRotate: () => dispatch(actions.disableRotate()),
    enableRotate: () => dispatch(actions.enableRotate()),
    setUIStateFoundDrew: () => dispatch(actions.setUIStateFoundDrew()),
    setUIStateEditingKeepout: () => dispatch(actions.setUIStateEditingKeepout()),
    terminateDrawing: () => dispatch(actions.terminateDrawing()),
    terminateKeepoutDrawing: () => dispatch(actions.terminateKeepoutDrawing()),
    releaseHoverPolyline: () => dispatch(actions.releaseHoverPolyline()),
    addPointOnPolyline: (cartesian, viewer) => dispatch(
      actions.addPointOnPolyline(cartesian, viewer)
    ),
    addPointOnKeepoutPolyline: (cartesian, viewer) => dispatch(
      actions.addPointOnKeepoutPolyline(cartesian, viewer)
    ),
    addVentTemplate: (cartesian, viewer) => dispatch(
      actions.addVentTemplate(cartesian, viewer)
    ),
    addTreeTemplate: (cartesian, viewer) => dispatch(
      actions.addTreeTemplate(cartesian, viewer)
    ),
    addOrClickPoint: (cartesian, viewer, pickedObject) => dispatch(
      actions.addOrClickPoint(cartesian, viewer, pickedObject)
    ),
    setPickedRoofTopPointIndex: () => dispatch(
      actions.setPickedRoofTopPointIndex()
    ),
    setUIStateSetUpBridging: () => dispatch(actions.setUIStateSetUpBridging()),
    placeInverter: () => dispatch(actions.placeInverter())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftClickHandler);
