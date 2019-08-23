import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';

const initialState = {
  viewer: null,
  enableRotate: true,
  initialCor: [-117.841416, 33.646859, 1000]
};

const setViewer = (state, action) => {
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

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_VIEWER: return setViewer(state, action);
    case actionTypes.ENABLE_ROTATION: return enableRotate(state, action);
    case actionTypes.DISABLE_ROTATION: return disableRotate(state, action);
    default: return state;
  }
};

export default reducer;
