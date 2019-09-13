import * as Cesium from 'cesium';
import uuid from 'uuid/v1';

import * as actionTypes from './actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';

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

export const terminateKeepoutDrawing = () => {
  return {
    type: actionTypes.KEEPOUT_TERMINATE_DRAWING
  }
};
