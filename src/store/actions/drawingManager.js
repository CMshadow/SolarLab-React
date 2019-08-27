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

export const complementPointOnPolyline = () => {
  return {
    type: actionTypes.CLICK_COMPLEMENT_POINT_ON_POLYLINE,
  };
};

export const setMouseCartesian3 = (mousePosition, viewer) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return {
      type: actionTypes.SET_MOUSE_CARTESIAN3,
      cartesian3: cartesian3
    };
  } else {
    return {
      type: actionTypes.DO_NOTHING
    };
  }
}

export const setHoverPolyline = () => {
  return ({
    type: actionTypes.SET_HOVERPOLYLINE
  });
};

export const releaseHoverPolyline = () => {
  return ({
    type: actionTypes.RELEASE_HOVERPOLYLINE
  });
};

export const setHoverPoint = (point) => {
  point.setColor(Cesium.Color.ORANGE);
  return ({
    type: actionTypes.SET_HOVERPOINT,
    hoverPoint: point
  });
};

export const releaseHoverPoint = () => (dispatch, getState) => {
  getState().drawingManagerReducer.hoverPoint.setColor(
    Cesium.Color.WHITE
  );
  return dispatch({
    type: actionTypes.RELEASE_HOVERPOINT
  });
};

export const setPickedPoint = (point) => {
  return ({
    type: actionTypes.SET_PICKEDPOINT,
    pickedPoint: point
  });
};

export const movePickedPoint = (mousePosition, viewer) => (dispatch, getState) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  getState().drawingManagerReducer.pickedPoint.setCartesian3Coordinate(
    cartesian3
  );
  if (Cesium.defined(cartesian3)) {
    return dispatch({
      type: actionTypes.MOVE_PICKEDPOINT,
    });
  } else {
    return dispatch({
      type: actionTypes.DO_NOTHING
    });
  }
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
