import * as Cesium from 'cesium';

import * as actionTypes from './actionTypes';
import Coordinate from '../../datastructure/point/coordinate';
import Point from '../../datastructure/point/point';

export const addPoint = (mousePosition, viewer) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return {
      type: actionTypes.CLICK_ADD_POINT,
      point: Point.fromCoordinate(Coordinate.fromCartesian(cartesian3))
    };
  } else {
    return {
      type: actionTypes.DO_NOTHING,
    };
  }
}

export const setViewer = (viewer) => {
  return {
    type: actionTypes.SET_VIEWER,
    viewer: viewer
  };
}

export const dragPoint = (mousePosition, viewer) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return {
      type: actionTypes.DRAG_POINT,
      point: Point.fromCoordinate(Coordinate.fromCartesian(cartesian3))
    };
  } else {
    return {
      type: actionTypes.DO_NOTHING,
    };
  }
}
