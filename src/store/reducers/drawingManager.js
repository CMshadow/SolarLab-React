import * as Cesium from 'cesium';


import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Point from '../../infrastructure/point/point';
import Polyline from '../../infrastructure/line/polyline';

const initialState = {
  drawingPolyline: null,
  fixedPoints : [],
  floatingPoints: null,

  hoverPoint: null,
  pickedPoint: null
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
    floatingPoints: Point.fromCoordinate(
      Coordinate.fromCartesian(action.cartesian3, 0.1)
    )
  };
}

const addPointOnPolyline = (state, action) => {
  const newFixedPoints = concatFixedFloating(state)
  let polyline = new Polyline(concatFixedFloating(state));
  return {
    ...state,
    drawingPolyline: polyline,
    fixedPoints: newFixedPoints
  };
}

const terminateDrawing = (state, action) => {
  const firstPoint = state.drawingPolyline.points[0]
  let fixedPoints = [...state.fixedPoints];
  fixedPoints = fixedPoints.concat(firstPoint);
  let polyline = new Polyline(fixedPoints);
  return {
    ...state,
    drawingPolyline: polyline,
    floatingPoints: null
  };
}

const setHoverPoint = (state, action) => {
  return {
    ...state,
    drawingPolyline: Polyline.fromPolyline(state.drawingPolyline),
    hoverPoint: action.hoverPoint
  };
};

const releaseHoverPoint = (state, action) => {
  return {
    ...state,
    drawingPolyline: Polyline.fromPolyline(state.drawingPolyline),
    hoverPoint: null
  };
};

const setPickedPoint = (state, action) => {
  return {
    ...state,
    pickedPoint: action.pickedPoint
  };
};

const movePickedPoint = (state, action) => {
  return {
    ...state,
    drawingPolyline: Polyline.fromPolyline(state.drawingPolyline),
  }
}

const releasePickedPoint = (state, action) => {
  return {
    ...state,
    pickedPoint: null
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.CLICK_ADD_POINT_ON_POLYLINE:
      return addPointOnPolyline(state, action);
    case actionTypes.DRAG_POLYLINE:
      return dragPolyline(state, action);
    case actionTypes.TERMINATE_DRAWING:
      return terminateDrawing(state, action);
    case actionTypes.SET_HOVERPOINT:
      return setHoverPoint(state, action);
    case actionTypes.RELEASE_HOVERPOINT:
      return releaseHoverPoint(state, action);
    case actionTypes.SET_PICKEDPOINT:
      return setPickedPoint(state, action);
    case actionTypes.MOVE_PICKEDPOINT:
      return movePickedPoint(state, action);
    case actionTypes.RELEASE_PICKEDPOINT:
      return releasePickedPoint(state, action);
    case actionTypes.DO_NOTHING:
    return state;
    default: return state;
  }
};

export default reducer;
