import * as Cesium from 'cesium';

import * as actionTypes from './actionTypes';

export const dragPolyline = (mousePosition, viewer) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return {
      type: actionTypes.DRAG_POLYLINE,
      cartesian3: cartesian3
    };
  } else {
    return {
      type: actionTypes.DO_NOTHING
    };
  }
};

export const addPointOnPolyline = (mousePosition, viewer) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return {
      type: actionTypes.CLICK_ADD_POINT_ON_POLYLINE,
      cartesian3: cartesian3
    };
  } else {
    return {
      type: actionTypes.DO_NOTHING
    };
  }
};

export const setHoverPoint = (point) => (dispatch, getState) => {
  console.log(point)
  console.log(getState().drawingManagerReducer.drawingPolyline.points)
  point.setColor(Cesium.Color.ORANGE);
  return dispatch({
    type: actionTypes.SET_HOVERPOINT,
    point: point
  });
};

export const releaseHoverPoint = () => (dispatch, getState) => {
  console.log('release hover point action')
  getState().drawingManagerReducer.drawingPolyline.hoverPoint.setColor(
    Cesium.Color.WHITE
  );
  return dispatch({
    type: actionTypes.RELEASE_HOVERPOINT
  });
};

export const setPickedPoint = (point) => {
  return ({
    type: actionTypes.SET_PICKEDPOINT,
    point: point
  });
};

export const releasePickedPoint = () => {
  return ({
    type: actionTypes.RELEASE_PICKEDPOINT
  });
};

export const terminateDrawing = () => {
  return {
    type: actionTypes.TERMINATE_DRAWING
  }
};
