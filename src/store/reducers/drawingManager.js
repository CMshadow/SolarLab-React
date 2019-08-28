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
 * @param {Cartesian3 || null}  mouseCartesian3 mouse realtime position in
 *                                              Carteisan3
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
  fixedPoints : [],
  floatingPoints: null,

  mouseCartesian3: null,
  hoverPolyline: null,
  hoverPoint: null,
  pickedPoint: null
};

const concatFixedFloating = (state) => {
  const concatPoints = [...state.fixedPoints, state.floatingPoints];
  return concatPoints;
};

const dragPolyline = (state, action) => {
  let polyline = new Polyline(concatFixedFloating(state));
  return {
    ...state,
    drawingPolyline: polyline,
    floatingPoints: Point.fromCoordinate(
      Coordinate.fromCartesian(action.cartesian3, 0.1)
    )
  };
};

const addPointOnPolyline = (state, action) => {
  const newFixedPoints = concatFixedFloating(state)
  let polyline = new Polyline(concatFixedFloating(state));
  return {
    ...state,
    drawingPolyline: polyline,
    fixedPoints: newFixedPoints
  };
};

const terminateDrawing = (state, action) => {
  const firstPoint = state.drawingPolyline.points[0]
  const fixedPoints = [...state.fixedPoints].concat(firstPoint);
  let polyline = new Polyline(fixedPoints);
  return {
    ...state,
    drawingPolyline: polyline,
    floatingPoints: null,
    fixedPoints: []
  };
};

const complementPointOnPolyline = (state, action) => {
  const indexToAdd = state.drawingPolyline.determineAddPointPosition(
    state.mouseCartesian3
  );
  const newPolyline = Polyline.fromPolyline(state.drawingPolyline);
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(state.mouseCartesian3, 0.1)
  );
  newPolyline.addPoint(indexToAdd, newPoint);
  return {
    ...state,
    drawingPolyline: newPolyline
  };
};

const deletePointOnPolyline = (state, action) => {
  const deletePosition = state.drawingPolyline.findPointIndex(state.hoverPoint);
  state.drawingPolyline.deletePoint(deletePosition)
  const newPolyline = Polyline.fromPolyline(state.drawingPolyline);
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
