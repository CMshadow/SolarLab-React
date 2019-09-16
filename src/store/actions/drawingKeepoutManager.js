import * as Cesium from 'cesium';

import * as actionTypes from './actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Env from '../../infrastructure/keepout/env';
import Vent from '../../infrastructure/keepout/vent';
import Tree from '../../infrastructure/keepout/tree';
import Passage from '../../infrastructure/keepout/passage';
import NormalKeepout from '../../infrastructure/keepout/normalKeepout';

export const createKeepout = (values) => {
  let newKeepout = null;
  switch (values.type) {
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
        null, values.type, values.height, values.setback
      );
      break;
    case 'TREE':
      newKeepout = new Tree(null, values.type, values.height);
      break;
    case 'ENV':
      newKeepout = new Env(null, values.type, values.height);
      break;
    default:
      newKeepout = new NormalKeepout(
        null, 'KEEPOUT', false, false, values.height, values.setback
      );
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
      updateKeepout = NormalKeepout.fromKeepout(
        keepoutList[updateIndex], values.height, values.setback
      );
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
  return dispatch({
    type: actionTypes.INIT_LINKED_KEEPOUT_INDEX,
    keepoutIndex: keepoutIndex
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
  return dispatch({
    type: actionTypes.SET_KEEPOUT_HOVERPOINT,
    hoverPointIndex: hoverIndex
  });
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
  return dispatch({
    type: actionTypes.SET_KEEPOUT_PICKEDPOINT,
    pickedPointIndex: pickedIndex
  });
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
