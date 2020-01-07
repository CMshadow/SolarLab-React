import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';

const initialState = {
  viewer: null,
  enableRotate: true,

  selectedMap: 'google'
};

const setViewer = (state, action) => {
  action.viewer.cesiumWidget.creditContainer.style.display = "none";
  action.viewer.scene.globe.depthTestAgainstTerrain = true;
  action.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_CLICK
  );
  action.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  );

  return {
    ...state,
    viewer: action.viewer,
  }
}

const enableRotate = (state, action) => {
  return {
    ...state,
    enableRotate: true
  };
};

const disableRotate = (state, action) => {
  return {
    ...state,
    enableRotate: false
  };
};

const selectMap = (state, action) => {
  return {
    ...state,
    selectedMap: action.selectedMap
  };
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_VIEWER: return setViewer(state, action);
    case actionTypes.ENABLE_ROTATION: return enableRotate(state, action);
    case actionTypes.DISABLE_ROTATION: return disableRotate(state, action);
    case actionTypes.SELECT_MAP: return selectMap(state, action);
    default: return state;
  }
};

export default reducer;
