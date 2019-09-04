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
  (mousePosition, viewer, pickedObject) => (dispatch, getState) => {
  const pointsRelation = getState().undoableReducer.present
  .drawingInnerManagerReducer.pointsRelation;
  const drawingInnerPolyline = getState().undoableReducer.present
  .drawingInnerManagerReducer.drawingInnerPolyline;

  if (pickedObject) {
    const onTopPointId = Object.keys(pointsRelation).find(elem => {
      return elem === pickedObject.id.id
    });
    if (onTopPointId) {
      if (drawingInnerPolyline) {
        return dispatch({
          type: actionTypes.ADD_END_POINT,
          point: pointsRelation[onTopPointId].object
        });
      } else {
        return dispatch({
          type: actionTypes.ADD_START_POINT,
          point: pointsRelation[onTopPointId].object
        });
      }
    }
  }
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
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
