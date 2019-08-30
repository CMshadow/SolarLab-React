import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Point from '../../infrastructure/point/point';
import Polyline from '../../infrastructure/line/polyline';

const initialState = {
  drawingPolyline: null,
  fixedPoints: [],

  mouseCartesian3: null,
  hoverPolyline: false,
  hoverPointIndex: null,
  pickedPointIndex: null
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
  const newPolyline = Polyline.fromPolyline(state.drawingPolyline);
  newPolyline.deletePoint(state.hoverPointIndex)
  return {
    ...state,
    drawingPolyline: newPolyline,
  };
};

const setMouseCartesian3 = (state, action) => {
  return {
    ...state,
    mouseCartesian3: action.cartesian3
  };
};

const setHoverPolyline = (state, action) => {
  const newPolyline = Polyline.fromPolyline(state.drawingPolyline);
  newPolyline.setColor(Cesium.Color.ORANGE);
  return {
    ...state,
    drawingPolyline: newPolyline,
    hoverPolyline: true
  };
};

const releaseHoverPolyline = (state, action) => {
  const newPolyline = Polyline.fromPolyline(state.drawingPolyline);
  newPolyline.setColor(Cesium.Color.WHITE);
  return {
    ...state,
    drawingPolyline: newPolyline,
    hoverPolyline: false
  };
};

const setHoverPointIndex = (state, action) => {
  const newPolyline = Polyline.fromPolyline(state.drawingPolyline);
  newPolyline.points[action.hoverPointIndex].setColor(Cesium.Color.ORANGE);
  return {
    ...state,
    drawingPolyline: newPolyline,
    hoverPointIndex: action.hoverPointIndex
  };
};

const releaseHoverPointIndex = (state, action) => {
  const newPolyline = Polyline.fromPolyline(state.drawingPolyline);
  newPolyline.points[state.hoverPointIndex].setColor(Cesium.Color.WHITE);
  return {
    ...state,
    drawingPolyline: newPolyline,
    hoverPointIndex: null
  };
};

const setPickedPointIndex = (state, action) => {
  return {
    ...state,
    pickedPointIndex: action.pickedPointIndex,
  };
};

const movePickedPoint = (state, action) => {
  const newPolyline = Polyline.fromPolyline(state.drawingPolyline);
  newPolyline.points[state.pickedPointIndex].setCartesian3Coordinate(action.cartesian3);
  return {
    ...state,
    drawingPolyline: newPolyline
  }
};

const releasePickedPointIndex = (state, action) => {
  return {
    ...state,
    pickedPointIndex: null,
  };
};

const cleanHoverAndColor = (state, action) => {
  state.drawingPolyline.points.map(elem => {
    return elem.setColor(Cesium.Color.WHITE);
  });
  return {
    ...state,
    hoverPolyline: false,
    hoverPointIndex: null,
    pickedPointIndex: null
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
      return setHoverPointIndex (state, action);
    case actionTypes.RELEASE_HOVERPOINT:
      return releaseHoverPointIndex (state, action);
    case actionTypes.SET_PICKEDPOINT:
      return setPickedPointIndex (state, action);
    case actionTypes.MOVE_PICKEDPOINT:
      return movePickedPoint (state, action);
    case actionTypes.RELEASE_PICKEDPOINT:
      return releasePickedPointIndex (state, action);
    case actionTypes.CLEAN_HOVER_AND_COLOR:
      return cleanHoverAndColor (state, action);
    case actionTypes.DO_NOTHING:
      return state;
    default: return state;
  }
};

export default reducer;
