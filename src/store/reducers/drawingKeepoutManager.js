import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import {
  createAuxPolyline,
  findTwoAuxPolylineIntersect
} from './drawingManager';
import Coordinate from '../../infrastructure/point/coordinate';
import Point from '../../infrastructure/point/point';
// import Polyline from '../../infrastructure/line/polyline';
import FoundLine from '../../infrastructure/line/foundLine';
import DashedLine from '../../infrastructure/line/dashedLine';
import BearingCollection from '../../infrastructure/math/bearingCollection';

const initialState = {
  drawingKeepoutPolyline: null,
  fixedPoints: [],
  brngCollection: null,
  auxPolyline: null,
  startPointAuxPolyline: null,

  mouseCartesian3: null,
  rightClickCartesian3: null,
  hoverPolyline: false,
  hoverPointIndex: null,
  pickedPointIndex: null
};

const dragKeepoutPolyline = (state, action) => {
  // Create Foundation Polyline
  const existPoints = state.fixedPoints.map(elem => {
    return Point.fromPoint(elem);
  });
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(action.cartesian3, 0.05), null, null, null,
    Cesium.Color.YELLOW
  );
  const polyline = new FoundLine(
    [...existPoints, newPoint], null, null, Cesium.Color.YELLOW
  );

  let auxPolyline = null;
  if (existPoints.length >= 2) {
    // Create Aux polyline
    auxPolyline =
      createAuxPolyline(state, existPoints[existPoints.length-1], newPoint);
  }
  return {
    ...state,
    drawingKeepoutPolyline: polyline,
    fixedPoints: existPoints,
    auxPolyline: auxPolyline,
    startPointAuxPolyline: null
  };
};

const addPointOnKeepoutPolyline = (state, action) => {
  const existPoints = state.fixedPoints.map(elem => {
    return Point.fromPoint(elem);
  });
  let newPoint = state.drawingKeepoutPolyline.points[state.drawingKeepoutPolyline.length-1];
  const polyline = new FoundLine(
    [...existPoints, newPoint], null, null, Cesium.Color.YELLOW
  );
  return {
    ...state,
    drawingKeepoutPolyline: polyline,
    fixedPoints: [...existPoints, newPoint],
    brngCollection: new BearingCollection(polyline.getHelpLineBearings())
  };
};

const terminateKeepoutDrawing = (state, action) => {
  const existPoints = state.fixedPoints.map(elem => {
    return Point.fromPoint(elem);
  });
  const polyline = new FoundLine([...existPoints, existPoints[0]]);
  return {
    ...state,
    drawingKeepoutPolyline: polyline,
    fixedPoints: [],
    auxPolyline: null,
    startPointAuxPolyline: null
  };
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.KEEPOUT_ADD_POINT:
      return addPointOnKeepoutPolyline (state, action);
    case actionTypes.KEEPOUT_DRAG_POLYLINE:
      return dragKeepoutPolyline (state, action);
    case actionTypes.KEEPOUT_TERMINATE_DRAWING:
      return terminateKeepoutDrawing (state, action);
    case actionTypes.DO_NOTHING:
      return state;
    default: return state;
  }
};

export default reducer;
