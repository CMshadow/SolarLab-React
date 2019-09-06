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
  const pickedObjectIdArray = pickedObjectArray.map(elem => elem.id.id);
  const pointsRelation = getState().undoableReducer.present
  .drawingInnerManagerReducer.pointsRelation;
  const drawingInnerPolyline = getState().undoableReducer.present
  .drawingInnerManagerReducer.drawingInnerPolyline;
  console.log(pickedObjectIdArray)
  console.log(pickedObjectIdArray !== [])
  if (pickedObjectIdArray.length !== 0) {
    const onTopPointId = Object.keys(pointsRelation).filter(
      x => pickedObjectIdArray.includes(x)
    );
    // const onTopPointId = Object.keys(pointsRelation).find(elem => {
    //   return elem === pickedObject.id.id
    // });
    console.log(onTopPointId)
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

};

export const setInnerTypeRidge = () => {

};
