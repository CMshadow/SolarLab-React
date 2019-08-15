import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../datastructure/point/coordinate';
import Point from '../../datastructure/point/point';
import Polyline from '../../datastructure/line/polyline';

const initialState = {
  viewer: null,
  initialCor : new Coordinate (-117.841548, 33.647111, 1000),
  points: [
    new Point(-117.841096, 33.647509, 0),
    new Point(-117.840650, 33.647242, 0),
  ],
  polyline :
    new Polyline([
      new Point(-117.841096, 33.647509, 0),
      new Point(-117.840650, 33.647242, 0)
  ])
};

const addPoint = (state, action) => {
  return {
    ...state,
    points : [...state.points, action.point]
  };
}

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
    viewer: action.viewer
  }
}

const dragPoint = (state, action) => {
  let newPoints = [...state.polyline.points];
  newPoints.pop();
  newPoints.push(action.point);
  return {
    ...state,
    polyline: new Polyline(newPoints)
  };
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.CLICK_ADD_POINT: return addPoint(state, action);
    case actionTypes.SET_VIEWER: return setViewer(state, action);
    case actionTypes.DRAG_POINT: return dragPoint(state, action);
    case actionTypes.DO_NOTHING: return state;
    default: return state;
  }
};

export default reducer;
