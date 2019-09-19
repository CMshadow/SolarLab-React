import * as Cesium from 'cesium';

import * as actionTypes from './actionTypes';
import Sector from '../../infrastructure/line/sector';
import Circle from '../../infrastructure/line/circle';
import Env from '../../infrastructure/keepout/env';
import Vent from '../../infrastructure/keepout/vent';
import Tree from '../../infrastructure/keepout/tree';
import Passage from '../../infrastructure/keepout/passage';
import NormalKeepout from '../../infrastructure/keepout/normalKeepout';

export const createKeepout = (values) => {
  let newKeepout = null;
  switch (values.type) {
    default:
    case 'KEEPOUT':
      newKeepout = new NormalKeepout(
        null, values.type, false, false, values.height, values.setback
      );
      break;
    case 'PASSAGE':
      newKeepout = new Passage(
        null, values.type, false, false, values.passageWidth
      );
      break;
    case 'VENT':
      newKeepout = new Vent(
        null, values.type, false, false, values.heading, values.radius,
        values.angle
      );
      break;
    case 'TREE':
      newKeepout = new Tree(null, values.type, false, false, values.height,
      values.radius);
      break;
    case 'ENV':
      newKeepout = new Env(null, values.type, false, false, values.height);
      break;
  }
  return {
    type: actionTypes.CREATE_KEEPOUT,
    newKeepout: newKeepout
  }
};

export const updateKeepout = (id, values) => (dispatch, getState) => {
  const keepoutList =
    getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList;
  const updateIndex = keepoutList.findIndex(elem => elem.id === id);
  let updateKeepout = null;
  switch (keepoutList[updateIndex].type) {
    default:
    case 'KEEPOUT':
      updateKeepout = NormalKeepout.fromKeepout(
        keepoutList[updateIndex], values.height, values.setback
      );
      break;

    case 'PASSAGE':
      updateKeepout = Passage.fromKeepout(
        keepoutList[updateIndex], values.width
      );
      break;

    case 'VENT':
      if (keepoutList[updateIndex].finishedDrawing) {
        const newPolyline = Sector.fromProps(
          keepoutList[updateIndex].outlinePolyline.originCor,
          values.heading,
          values.radius,
          values.angle,
          null, null, Cesium.Color.CADETBLUE
        );
        updateKeepout = Vent.fromKeepout(
          keepoutList[updateIndex], values.heading, values.radius, values.angle,
          newPolyline
        );
      } else {
        updateKeepout = Vent.fromKeepout(
          keepoutList[updateIndex], values.heading, values.radius, values.angle
        );
      }
      break;

    case 'TREE':
      if (keepoutList[updateIndex].finishedDrawing) {
        const newPolyline = Circle.fromProps(
          keepoutList[updateIndex].outlinePolyline.centerPoint,
          values.radius,
          null, null, Cesium.Color.FORESTGREEN
        );
        updateKeepout = Tree.fromKeepout(
          keepoutList[updateIndex], values.height, values.radius,
          newPolyline
        );
      } else {
        updateKeepout = Tree.fromKeepout(
          keepoutList[updateIndex], values.height, values.radius
        );
      }
      break;

    case 'ENV':
      updateKeepout = Env.fromKeepout(
        keepoutList[updateIndex], values.height
      );
      break;
  }
  return dispatch({
    type: actionTypes.UPDATE_KEEPOUT,
    updateKeepout: updateKeepout,
    updateIndex: updateIndex
  });
};

export const deleteKeepout = (id) => (dispatch, getState) => {
  const keepoutList =
    getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList;
  const deleteIndex = keepoutList.findIndex(elem => elem.id === id);
  return dispatch({
    type: actionTypes.DELETE_KEEPOUT,
    deleteIndex: deleteIndex
  });
};

export const initLinkedKeepoutIndex = (keepoutId) => (dispatch, getState) => {
  const keepoutIndex =
    getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList
    .findIndex(elem => elem.id === keepoutId);
  const keepoutType =
    getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList[
      keepoutIndex
    ].type;
  return dispatch({
    type: actionTypes.INIT_LINKED_KEEPOUT_INDEX,
    keepoutIndex: keepoutIndex,
    keepoutType: keepoutType
  });
};

export const releaseLinkedKeepoutIndex = () => {
  return {
    type: actionTypes.RELEASE_LINKED_KEEPOUT_INDEX,
  };
};

export const addPointOnKeepoutPolyline = (mousePosition, viewer, fixedMode=false) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return {
      type: actionTypes.KEEPOUT_ADD_POINT,
      fixedMode: fixedMode,
      cartesian3: cartesian3
    };
  } else {
    return {
      type: actionTypes.DO_NOTHING
    };
  }
};

export const addVentTemplate = (mousePosition, viewer) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return {
      type: actionTypes.KEEPOUT_ADD_VENT_TEMPLATE,
      cartesian3: cartesian3
    };
  } else {
    return {
      type: actionTypes.DO_NOTHING
    };
  }
}

export const addTreeTemplate = (mousePosition, viewer) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return {
      type: actionTypes.KEEPOUT_ADD_TREE_TEMPLATE,
      cartesian3: cartesian3
    };
  } else {
    return {
      type: actionTypes.DO_NOTHING
    };
  }
}

export const dragKeepoutPolyline = (mousePosition, viewer) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return {
      type: actionTypes.KEEPOUT_DRAG_POLYLINE,
      cartesian3: cartesian3
    };
  } else {
    return {
      type: actionTypes.DO_NOTHING
    };
  }
};

export const dragKeepoutPolylineFixedMode = (mousePosition, viewer) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return {
      type: actionTypes.KEEPOUT_DRAG_POLYLINE_FIXED_MODE,
      cartesian3: cartesian3
    };
  } else {
    return {
      type: actionTypes.DO_NOTHING
    };
  }
};

export const terminateKeepoutDrawing = () => {
  return {
    type: actionTypes.KEEPOUT_TERMINATE_DRAWING
  }
};

export const setKeepoutHoverPolyline = () => {
  return ({
    type: actionTypes.SET_KEEPOUT_HOVERPOLYLINE
  });
};

export const releaseKeepoutHoverPolyline = () => {
  return ({
    type: actionTypes.RELEASE_KEEPOUT_HOVERPOLYLINE
  });
};

export const setKeepoutHoverPointIndex = (point) => (dispatch, getState) => {
  const hoverIndex = getState().undoableReducer.present
  .drawingKeepoutManagerReducer.drawingKeepoutPolyline.findPointIndex(point);
  if (hoverIndex >= 0) {
    return dispatch({
      type: actionTypes.SET_KEEPOUT_HOVERPOINT,
      hoverPointIndex: hoverIndex
    });
  } else if (
    getState().undoableReducer.present.drawingKeepoutManagerReducer
    .drawingKeepoutPolyline.centerPoint.entityId === point.entityId
  ) {
    return dispatch({
      type: actionTypes.SET_KEEPOUT_HOVERPOINT,
      hoverPointIndex: 'centerPoint'
    });
  }
};

export const releaseKeepoutHoverPointIndex = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.RELEASE_KEEPOUT_HOVERPOINT
  });
};

export const complementPointOnKeepoutPolyline = () => (dispatch, getState) => {
  const rightClickCartesian3 =
    getState().undoableReducer.present.drawingManagerReducer.rightClickCartesian3;
  return dispatch({
    type: actionTypes.CLICK_COMPLEMENT_POINT_ON_KEEPOUT_POLYLINE,
    rightClickCartesian3: rightClickCartesian3
  });
};

export const deletePointOnKeepoutPolyline = () => {
  return {
    type: actionTypes.CLICK_DELETE_POINT_ON_KEEPOUT_POLYLINE
  };
};

export const setKeepoutPickedPointIndex = (point) => (dispatch, getState) => {
  const pickedIndex = getState().undoableReducer.present
  .drawingKeepoutManagerReducer.drawingKeepoutPolyline.findPointIndex(point);
  if (pickedIndex >= 0) {
    return dispatch({
      type: actionTypes.SET_KEEPOUT_PICKEDPOINT,
      pickedPointIndex: pickedIndex
    });
  } else if (
    getState().undoableReducer.present.drawingKeepoutManagerReducer
    .drawingKeepoutPolyline.centerPoint.entityId === point.entityId
  ) {
    return dispatch({
      type: actionTypes.SET_KEEPOUT_PICKEDPOINT,
      pickedPointIndex: 'centerPoint'
    });
  }
};

export const moveKeepoutPickedPoint = (mousePosition, viewer) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return ({
      type: actionTypes.MOVE_KEEPOUT_PICKEDPOINT,
      cartesian3: cartesian3
    });
  } else {
    return ({
      type: actionTypes.DO_NOTHING
    });
  }
};

export const releaseKeepoutPickedPointIndex = () => {
  return ({
    type: actionTypes.RELEASE_KEEPOUT_PICKEDPOINT
  });
};
