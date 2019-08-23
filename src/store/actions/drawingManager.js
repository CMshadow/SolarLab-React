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

export const setPickedPoint = () => {

};

export const terminateDrawing = () => {
  return {
    type: actionTypes.TERMINATE_DRAWING
  }
};
