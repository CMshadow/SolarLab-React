import * as Cesium from 'cesium';

import * as actionTypes from './actionTypes';

export const passFoundPolyline = () => (dispatch, getState) => {
  const foundPolyline = getState().undoableReducer.present
  .drawingManagerReducer.drawingPolyline;
  return dispatch({
    type: actionTypes.PASS_FOUND_POLYLINE,
    foundPolyline: foundPolyline
  });
};

export const addOrClickPoint =
  (mousePosition, viewer, pickedObjectArray) => (dispatch, getState) => {

  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  const pickedObjectIdArray = pickedObjectArray.map(elem => elem.id.id);
  const foundPolyline = getState().undoableReducer.present
  .drawingInnerManagerReducer.foundPolyline;
  const pointsRelation = getState().undoableReducer.present
  .drawingInnerManagerReducer.pointsRelation;
  const drawingInnerPolyline = getState().undoableReducer.present
  .drawingInnerManagerReducer.drawingInnerPolyline;

  if (pickedObjectIdArray.length !== 0) {
    const onTopPointId = Object.keys(pointsRelation).filter(
      x => pickedObjectIdArray.includes(x)
    );
    const onTopFoundPolyline = pickedObjectIdArray.includes(foundPolyline.entityId);
    if (onTopPointId.length !== 0) {
      if (drawingInnerPolyline) {
        return dispatch({
          type: actionTypes.ADD_END_POINT,
          point: pointsRelation[onTopPointId[0]].object
        });
      } else {
        return dispatch({
          type: actionTypes.ADD_START_POINT,
          point: pointsRelation[onTopPointId[0]].object
        });
      }
    }
    else if (onTopFoundPolyline) {
      const foundAddPointPosition = foundPolyline.determineAddPointPosition(
        cartesian3
      );
      if (drawingInnerPolyline) {
        return dispatch({
          type: actionTypes.ADD_END_POINT,
          cartesian3: cartesian3,
          foundAddPointPosition: foundAddPointPosition
        });
      } else {
        return dispatch({
          type: actionTypes.ADD_START_POINT,
          cartesian3: cartesian3,
          foundAddPointPosition: foundAddPointPosition
        });
      }
    }
  }
  if (drawingInnerPolyline) {
    return dispatch({
      type: actionTypes.ADD_END_POINT,
      cartesian3: cartesian3
    });
  } else {
    return dispatch({
      type: actionTypes.ADD_START_POINT,
      cartesian3: cartesian3
    });
  }
};

export const dragDrawingInnerPolyline = (mousePosition, viewer) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return {
      type: actionTypes.DRAG_INNER_POLYLINE,
      cartesian3: cartesian3
    };
  } else {
    return {
      type: actionTypes.DO_NOTHING
    };
  }
};

export const deleteInnerPointOnPolyline = () => {

};

export const setInnerTypeHip = () => {
  return {
    type: actionTypes.SET_TYPE_HIP
  };
};

export const setInnerTypeRidge = () => {
  return {
    type: actionTypes.SET_TYPE_RIDGE
  };
};

const findInnerLineIndex = (fixedInnerLine, findInnerLine) => {
  const i = fixedInnerLine.reduce((p, elem, index, array) => {
    return elem.entityId === p.entityId ? index : p
  }, findInnerLine);
  if (i === findInnerLine) {
    return -1;
  }
  return i;
}

export const setHoverInnerLine = (innerLine) => (dispatch, getState) => {
  const index = findInnerLineIndex(
    getState().undoableReducer.present.drawingInnerManagerReducer
    .fixedInnerPolylines,
    innerLine
  );
  return dispatch({
    type: actionTypes.SET_HOVER_INNER_LINE,
    hoverInnerLineIndex: index
  });
};

export const releaseHoverInnerLine = () => {
  return ({
    type: actionTypes.RELEASE_HOVER_INNER_LINE
  });
};

export const setHoverInnerPoint = () => {
  return ({
    type: actionTypes.SET_HOVER_INNER_POINT
  });
};

export const releaseHoverInnerPoint = () => {
  return ({
    type: actionTypes.RELEASE_HOVER_INNER_POINT
  });
};
