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

export const dragPolylineFixedMode = (mousePosition, viewer) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return {
      type: actionTypes.DRAG_POLYLINE_FIXED_MODE,
      cartesian3: cartesian3
    };
  } else {
    return {
      type: actionTypes.DO_NOTHING
    };
  }
};

export const addPointOnPolyline = (mousePosition, viewer, fixedMode=false) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return {
      type: actionTypes.CLICK_ADD_POINT_ON_POLYLINE,
      fixedMode: fixedMode,
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

export const deletePointOnPolyline = () => {
  return {
    type: actionTypes.CLICK_DELETE_POINT_ON_POLYLINE
  };
};

export const setMouseCartesian3 = (mousePosition, viewer) => {
  let cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (cartesian3) cartesian3 = viewer.scene.clampToHeight(cartesian3);
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
};

export const setRightClickCartesian3 = (mousePosition, viewer) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return {
      type: actionTypes.SET_RIGHT_CLICK_CARTESIAN3,
      cartesian3: cartesian3
    };
  } else {
    return {
      type: actionTypes.DO_NOTHING
    };
  }
};

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

export const setHoverPointIndex = (point) => (dispatch, getState) => {
  const hoverIndex = getState().undoable.present.drawingManager
    .drawingPolyline.findPointIndex(point);
  return dispatch({
    type: actionTypes.SET_HOVERPOINT,
    hoverPointIndex: hoverIndex
  });
};

export const releaseHoverPointIndex = () => (dispatch, getState) => {
  return dispatch({
    type: actionTypes.RELEASE_HOVERPOINT
  });
};

export const setPickedPointIndex = (point) => (dispatch, getState) => {
  const pickedIndex = getState().undoable.present.drawingManager
    .drawingPolyline.findPointIndex(point);
  return dispatch({
    type: actionTypes.SET_PICKEDPOINT,
    pickedPointIndex: pickedIndex
  });
};

export const movePickedPoint = (mousePosition, viewer) => {
  const cartesian3 = viewer.scene.pickPosition(mousePosition);
  if (Cesium.defined(cartesian3)) {
    return ({
      type: actionTypes.MOVE_PICKEDPOINT,
      cartesian3: cartesian3
    });
  } else {
    return ({
      type: actionTypes.DO_NOTHING
    });
  }
};

export const releasePickedPointIndex = () => {
  return ({
    type: actionTypes.RELEASE_PICKEDPOINT
  });
};

export const terminateDrawing = () => {
  return {
    type: actionTypes.TERMINATE_DRAWING
  }
};

export const cleanHoverAndColor = () => {
  return {
    type: actionTypes.CLEAN_HOVER_AND_COLOR
  }
}

export const exitCurrentDrawing = () => {
  return {
    type: actionTypes.EXIT_CURRENT_DRAWING
  };
};
