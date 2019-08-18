import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Point from '../../infrastructure/point/point';
import Polyline from '../../infrastructure/line/polyline';

const initialState = {
  drawingPolyline: null,
  fixedPoints : [],
  floatingPoints: null,
};

const concatFixedFloating = (state) => {
  const concatPoints = [...state.fixedPoints, state.floatingPoints];
  return concatPoints;
}

const dragPolyline = (state, action) => {
  let polyline = new Polyline(concatFixedFloating(state));
  return {
    ...state,
    drawingPolyline: polyline,
    floatingPoints: Point.fromCoordinate(Coordinate.fromCartesian(action.cartesian3), 0.1)
  };
}

const addPointOnPolyline = (state, action) => {
  let polyline = new Polyline(concatFixedFloating(state));
  let newFixedPoints = [...state.fixedPoints, Point.fromCoordinate(Coordinate.fromCartesian(action.cartesian3), 0.1)]
  return {
    ...state,
    drawingPolyline: polyline,
    fixedPoints: newFixedPoints
  };
}

const terminateDrawing = (state, action) => {
  const firstPoint = Point.fromPoint(state.drawingPolyline.points[0])
  let fixedPoints = [...state.fixedPoints];
  fixedPoints = fixedPoints.concat(firstPoint);
  let polyline = new Polyline(fixedPoints);
  return {
    ...state,
    drawingPolyline: polyline,
    fixedPoints: fixedPoints
  };
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.CLICK_ADD_POINT_ON_POLYLINE: return addPointOnPolyline(state, action);
    case actionTypes.DRAG_POLYLINE: return dragPolyline(state, action);
    case actionTypes.TERMINATE_DRAWING: return terminateDrawing(state, action);
    case actionTypes.DO_NOTHING: return state;
    default: return state;
  }
};

export default reducer;
