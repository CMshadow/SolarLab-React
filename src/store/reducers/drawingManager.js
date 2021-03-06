import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Point from '../../infrastructure/point/point';
import FoundLine from '../../infrastructure/line/foundLine';
import DashedLine from '../../infrastructure/line/dashedLine';
import BearingCollection from '../../infrastructure/math/bearingCollection';
import ErrorNotification from '../../components/ui/Notification/ErrorNotification';

const initialState = {
  drawingPolyline: null,
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

export const createAuxPolyline = (state, originPoint, mousePoint) => {
  const mouseBrng = Coordinate.bearing(
    originPoint, mousePoint
  );
  const closestBrng = state.brngCollection.findClosestBrng(mouseBrng);
  const closestDest = Coordinate.destination(
    originPoint, closestBrng, 10
  );
  return new DashedLine(
    [originPoint, Point.fromCoordinate(closestDest)]
  );
}

export const findTwoAuxPolylineIntersect = (state, existPoints, mousePoint) => {
  const startPoint = existPoints[0];
  const startPointMouseBrng = Coordinate.bearing(
    startPoint, mousePoint
  );
  const startPointClosestBrng =
    state.brngCollection.findClosestBrng(startPointMouseBrng);
  const latestPoint = existPoints[existPoints.length-1];
  const latestMouseBrng = Coordinate.bearing(
    latestPoint, mousePoint
  );
  const latestClosestBrng =
    state.brngCollection.findClosestBrng(latestMouseBrng);
  const intersection = Coordinate.intersection(
    startPoint, startPointClosestBrng, latestPoint, latestClosestBrng
  );
  return intersection;
}

const dragPolyline = (state, action) => {
  // Create Foundation Polyline
  const existPoints = state.fixedPoints.map(elem => {
    return Point.fromPoint(elem);
  });
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(action.cartesian3, 0.05)
  );
  const polyline = new FoundLine([...existPoints, newPoint]);

  let auxPolyline = null;
  if (existPoints.length >= 2) {
    // Create Aux polyline
    auxPolyline =
      createAuxPolyline(state, existPoints[existPoints.length-1], newPoint);
  }

  return {
    ...state,
    drawingPolyline: polyline,
    fixedPoints: existPoints,
    auxPolyline: auxPolyline,
    startPointAuxPolyline: null
  };
};

const dragPolylineFixedMode = (state, action) => {
  // Create Foundation Polyline
  const existPoints = state.fixedPoints.map(elem => {
    return Point.fromPoint(elem);
  });
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(action.cartesian3, 0.05)
  );
  const mouseBrng = Coordinate.bearing(
    existPoints[existPoints.length-1], newPoint
  );
  const closestBrng = state.brngCollection.findClosestBrng(mouseBrng);
  const fixedDest = closestBrng ? Coordinate.destination(
    existPoints[existPoints.length - 1],
    closestBrng,
    Math.cos(Cesium.Math.toRadians(closestBrng-mouseBrng)) *
    Coordinate.surfaceDistance(existPoints[existPoints.length - 1], newPoint)
  ) : newPoint;

  let polyline = new FoundLine(
    [...existPoints, Point.fromCoordinate(fixedDest)]
  );

  const intersectionMinDist = 1;
  let auxPolyline = null;
  let startPointAuxPolyline = null;
  if (existPoints.length >= 2) {
    const intersection =
      findTwoAuxPolylineIntersect(state, existPoints, fixedDest);
    if (
      Coordinate.surfaceDistance(intersection, newPoint) < intersectionMinDist
    ) {
      // Create Aux polyline
      auxPolyline = new DashedLine(
        [existPoints[existPoints.length-1], Point.fromCoordinate(intersection)]
      );
      // Create Aux polyline at start point
      startPointAuxPolyline =new DashedLine(
        [existPoints[0], Point.fromCoordinate(intersection)]
      );
      //update polyline to stick on intersection
      polyline = new FoundLine(
        [...existPoints, Point.fromCoordinate(intersection)]
      );
    } else {
      // Create Aux polyline
      auxPolyline =
        createAuxPolyline(state, existPoints[existPoints.length-1], newPoint);
      // Create Aux polyline at start point
      startPointAuxPolyline =
        createAuxPolyline(state, existPoints[0], newPoint);
    }
  }

  return {
    ...state,
    drawingPolyline: polyline,
    fixedPoints: existPoints,
    auxPolyline: auxPolyline,
    startPointAuxPolyline: startPointAuxPolyline
  };
};

const addPointOnPolyline = (state, action) => {
  if (state.drawingPolyline.length > 2 &&
    state.drawingPolyline.isSelfIntersection()
  ) {
    ErrorNotification(
      'Drawing Error', 'Drawing Line cannot be self-intersected'
    );
    return state;
  }
  const existPoints = state.fixedPoints.map(elem => {
    return Point.fromPoint(elem);
  });
  const newPoint = Point.fromPoint(
    state.drawingPolyline.points[state.drawingPolyline.length-1]
  );
  const trailingPoint = Point.fromPoint(
    state.drawingPolyline.points[state.drawingPolyline.length-1]
  );
  const polyline = new FoundLine([...existPoints, newPoint, trailingPoint]);
  return {
    ...state,
    drawingPolyline: polyline,
    fixedPoints: [...existPoints, newPoint],
    brngCollection: new BearingCollection(polyline.getHelpLineBearings())
  };
};

const terminateDrawing = (state, action) => {
  const existPoints = state.fixedPoints.map(elem => {
    return Point.fromPoint(elem);
  });
  const polyline = new FoundLine([...existPoints, existPoints[0]]);
  if (polyline.length < 4) {
    ErrorNotification(
      'Drawing Error', 'Not enough vertices to build a foundation'
    );
    return state;
  }
  if (polyline.isSelfIntersection()) {
    ErrorNotification(
      'Drawing Error', 'Drawing Line cannot be self-intersected'
    );
    return state;
  }
  return {
    ...state,
    drawingPolyline: polyline,
    fixedPoints: [],
    auxPolyline: null,
    startPointAuxPolyline: null
  };
};

const complementPointOnPolyline = (state, action) => {
  const indexToAdd = state.drawingPolyline.determineAddPointPosition(
    state.rightClickCartesian3
  );
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(state.rightClickCartesian3, 0.05)
  );
  const newPolyline = FoundLine.fromPolyline(state.drawingPolyline);
  newPolyline.addPointPrecision(indexToAdd, newPoint)
  return {
    ...state,
    drawingPolyline: newPolyline
  };
};

const deletePointOnPolyline = (state, action) => {
  const newPolyline = FoundLine.fromPolyline(state.drawingPolyline);
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

const setRightClickCartesian3 = (state, action) => {
  return {
    ...state,
    rightClickCartesian3: action.cartesian3
  };
};

const setHoverPolyline = (state, action) => {
  const newPolyline = FoundLine.fromPolyline(state.drawingPolyline);
  newPolyline.setColor(Cesium.Color.ORANGE);
  return {
    ...state,
    drawingPolyline: newPolyline,
    hoverPolyline: true
  };
};

const releaseHoverPolyline = (state, action) => {
  if (state.hoverPolyline) {
    const newPolyline = FoundLine.fromPolyline(state.drawingPolyline);
    newPolyline.setColor(Cesium.Color.WHITE);
    return {
      ...state,
      drawingPolyline: newPolyline,
      hoverPolyline: false
    };
  } else {
    return state;
  }
};

const setHoverPointIndex = (state, action) => {
  if (state.hoverPointIndex !== null) releaseHoverPointIndex(state, action);

  const newPolyline = FoundLine.fromPolyline(state.drawingPolyline);
  newPolyline.points[action.hoverPointIndex].setColor(Cesium.Color.ORANGE);
  return {
    ...state,
    drawingPolyline: newPolyline,
    hoverPointIndex: action.hoverPointIndex
  };
};

const releaseHoverPointIndex = (state, action) => {
  if (state.hoverPointIndex !== null) {
    const newPolyline = FoundLine.fromPolyline(state.drawingPolyline);
    newPolyline.points[state.hoverPointIndex].setColor(Cesium.Color.WHITE);
    return {
      ...state,
      drawingPolyline: newPolyline,
      hoverPointIndex: null
    };
  } else {
    return state;
  }
};

const setPickedPointIndex = (state, action) => {
  return {
    ...state,
    pickedPointIndex: action.pickedPointIndex,
  };
};

const movePickedPoint = (state, action) => {
  const newPolyline = FoundLine.fromPolyline(state.drawingPolyline);
  newPolyline.points[state.pickedPointIndex]
  .setCartesian3Coordinate(action.cartesian3, 0.05);
  return {
    ...state,
    drawingPolyline: newPolyline
  }
};

const releasePickedPointIndex = (state, action) => {
  return {
    ...state,
    pickedPointIndex: null,
    brngCollection:
      new BearingCollection(state.drawingPolyline.getHelpLineBearings())
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

const addExtraInnerPoint = (state, action) => {
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(state.mouseCartesian3, 0.05), null, action.uniqueId
  );
  const newPolyline = FoundLine.fromPolyline(state.drawingPolyline);
  newPolyline.addPointPrecision(action.foundAddPointPosition, newPoint);
  return {
    ...state,
    drawingPolyline: newPolyline
  };
};

const exitCurrentDrawing = (state, action) => {
  return initialState;
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.CLICK_ADD_POINT_ON_POLYLINE:
      return addPointOnPolyline (state, action);
    case actionTypes.DRAG_POLYLINE:
      return dragPolyline (state, action);
    case actionTypes.DRAG_POLYLINE_FIXED_MODE:
      return dragPolylineFixedMode (state, action);
    case actionTypes.TERMINATE_DRAWING:
      return terminateDrawing (state, action);
    case actionTypes.CLICK_COMPLEMENT_POINT_ON_POLYLINE:
      return complementPointOnPolyline (state, action);
    case actionTypes.CLICK_DELETE_POINT_ON_POLYLINE:
      return deletePointOnPolyline (state, action);
    case actionTypes.SET_MOUSE_CARTESIAN3:
      return setMouseCartesian3 (state, action);
    case actionTypes.SET_RIGHT_CLICK_CARTESIAN3:
      return setRightClickCartesian3 (state, action);
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
    case actionTypes.ADD_START_POINT_ON_FOUND:
      return addExtraInnerPoint (state, action);
    case actionTypes.ADD_END_POINT_ON_FOUND:
      return addExtraInnerPoint (state, action);
    case actionTypes.EXIT_CURRENT_DRAWING:
      return exitCurrentDrawing (state, action);
    case actionTypes.DO_NOTHING:
      return state;
    default: return state;
  }
};

export default reducer;
