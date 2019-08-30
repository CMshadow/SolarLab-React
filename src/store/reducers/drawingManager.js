import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Point from '../../infrastructure/point/point';
import Polyline from '../../infrastructure/line/polyline';

/**
 * The state manager for drawing and editing polyline
 * @param {Polyline || null}  drawingPolyline the working on Polyline object;
 *                                            null by default;
 *                                            initialized when starting drawing
 *                                            the Polyline;
 * @param {Point[] || []} fixedPoints a array of fixed Points in the Polyline
 *                                    object;
 *                                    empty array by default;
 *                                    should only be used while dynamically
 *                                    drawing the Polyline object;
 * @param {Point || null} floatingPoints  the floating Point while drawing the
 *                                        Polyline object;
 *                                        null by default;
 *                                        should only be used while dynamically
 *                                        drawing the Polyline object;
 * @param {Polyline || null}  hoverPolyline  ref to drawingPolyline while mouse
 *                                           hover on the Polyline;
 *                                           null while mouse leaving the
 *                                           Polyline;
 * @param {Point || null} hoverPoint  ref to the Point mouse hovering on, it
 *                                    could be any point in the Polyline;
 *                                    null while mouse is not hoving on any
 *                                    point in the Polyline;
 * @param {Point || null} pickedPoint ref to the Point mouse is clicking on, it
 *                                    could be any point in the Polyline;
 *                                    null while mouse is not clicking on any
 *                                    point in the Polyline;
 */
const initialState = {
  drawingPolyline: null,
  fixedPoints: [],

  mouseCartesian3: null,
  hoverPolyline: null,
  hoverPoint: null,
  pickedPoint: null
};

const dragPolyline = (state, action) => {
  const existPoints = state.fixedPoints.map(elem => {
    return Point.fromPoint(elem);
  });
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(action.cartesian3, 0.1)
  );
  const polyline = new Polyline([...existPoints, newPoint]);
  return {
    ...state,
    drawingPolyline: polyline,
    fixedPoints: existPoints
  };
};

const addPointOnPolyline = (state, action) => {
  const existPoints = state.fixedPoints.map(elem => {
    return Point.fromPoint(elem);
  });
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(action.cartesian3, 0.1)
  );
  const polyline = new Polyline([...existPoints, newPoint]);
  return {
    ...state,
    drawingPolyline: polyline,
    fixedPoints: [...existPoints, newPoint]
  };
};

const terminateDrawing = (state, action) => {
  const existPoints = state.fixedPoints.map(elem => {
    return Point.fromPoint(elem);
  });
  const polyline = new Polyline([...existPoints, existPoints[0]]);
  return {
    ...state,
    drawingPolyline: polyline,
    fixedPoints: []
  };
};

const complementPointOnPolyline = (state, action) => {
  const indexToAdd = state.drawingPolyline.determineAddPointPosition(
    state.mouseCartesian3
  );
  console.log(indexToAdd)
  const existPoints = state.drawingPolyline.points.map(elem => {
    return Point.fromPoint(elem);
  });
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(state.mouseCartesian3, 0.1)
  );
  existPoints.splice(indexToAdd, 0, newPoint)
  const newPolyline = new Polyline(existPoints);
  return {
    ...state,
    drawingPolyline: newPolyline
  };
};

const deletePointOnPolyline = (state, action) => {
  const deletePosition = state.drawingPolyline.findPointIndex(state.hoverPoint);
  console.log(deletePosition)
  const newPolyline = Polyline.fromPolyline(state.drawingPolyline);
  newPolyline.deletePoint(deletePosition)
  return {
    ...state,
    drawingPolyline: newPolyline
  };
};

const setMouseCartesian3 = (state, action) => {
  return {
    ...state,
    mouseCartesian3: action.cartesian3
  };
};

const setHoverPolyline = (state, action) => {
  return {
    ...state,
    hoverPolyline: state.drawingPolyline
  };
};

const releaseHoverPolyline = (state, action) => {
  return {
    ...state,
    hoverPolyline: null
  };
};

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
      return addPointOnPolyline (state, action);
    case actionTypes.DRAG_POLYLINE:
      return dragPolyline (state, action);
    case actionTypes.TERMINATE_DRAWING:
      return terminateDrawing (state, action);
    case actionTypes.CLICK_COMPLEMENT_POINT_ON_POLYLINE:
      return complementPointOnPolyline (state, action);
    case actionTypes.CLICK_DELETE_POINT_ON_POLYLINE:
      return deletePointOnPolyline (state, action);
    case actionTypes.SET_MOUSE_CARTESIAN3:
      return setMouseCartesian3 (state, action);
    case actionTypes.SET_HOVERPOLYLINE:
      return setHoverPolyline (state, action);
    case actionTypes.RELEASE_HOVERPOLYLINE:
      return releaseHoverPolyline (state, action);
    case actionTypes.SET_HOVERPOINT:
      return setHoverPoint (state, action);
    case actionTypes.RELEASE_HOVERPOINT:
      return releaseHoverPoint (state, action);
    case actionTypes.SET_PICKEDPOINT:
      return setPickedPoint (state, action);
    case actionTypes.MOVE_PICKEDPOINT:
      return movePickedPoint (state, action);
    case actionTypes.RELEASE_PICKEDPOINT:
      return releasePickedPoint (state, action);
    case actionTypes.DO_NOTHING:
      return state;
    default: return state;
  }
};

export default reducer;
