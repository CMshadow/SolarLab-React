import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import {
  createAuxPolyline,
  findTwoAuxPolylineIntersect
} from './drawingManager';
import Coordinate from '../../infrastructure/point/coordinate';
import Point from '../../infrastructure/point/point';
import FoundLine from '../../infrastructure/line/foundLine';
import DashedLine from '../../infrastructure/line/dashedLine';
import BearingCollection from '../../infrastructure/math/bearingCollection';
import NormalKeepout from '../../infrastructure/keepout/normalKeepout';

const initialState = {
  keepoutList: [],
  linkedKeepoutIndex: null,
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

const createKeepout = (state, action) => {
  return {
    ...state,
    initialForm: false,
    keepoutList: [...state.keepoutList, action.newKeepout]
  };
};

const updateKeepout = (state, action) => {
  const newKeepoutList = [...state.keepoutList];
  newKeepoutList.splice(action.updateIndex, 1, action.updateKeepout);
  return {
    ...state,
    keepoutList: newKeepoutList
  }
};

const deleteKeepout = (state, action) => {
  const newKeepoutList = [...state.keepoutList];
  newKeepoutList.splice(action.deleteIndex, 1);
  return {
    ...state,
    keepoutList: newKeepoutList
  }
};

const initLinkedKeepoutIndex = (state, action) => {
  const newKeepoutList = [...state.keepoutList];
  const newKeepout = NormalKeepout.fromKeepout(
    newKeepoutList[action.keepoutIndex]
  );
  newKeepout.setIsEditing();
  newKeepoutList.splice(action.keepoutIndex, 1, newKeepout);

  const readPolyline =
    newKeepout.finishedDrawing ? newKeepout.outlinePolyline : null;
  return {
    ...state,
    drawingKeepoutPolyline: readPolyline,
    keepoutList: newKeepoutList,
    linkedKeepoutIndex: action.keepoutIndex
  };
};

const releaseLinkedKeepoutIndex = (state, action) => {
  const newKeepoutList = [...state.keepoutList];
  let newKeepout = null;
  if (newKeepoutList[state.linkedKeepoutIndex].finishedDrawing) {
    newKeepout = NormalKeepout.fromKeepout(
      newKeepoutList[state.linkedKeepoutIndex], null, null,
      FoundLine.fromPolyline(state.drawingKeepoutPolyline)
    );
  } else {
    newKeepout = NormalKeepout.fromKeepout(
      newKeepoutList[state.linkedKeepoutIndex]
    );
  }
  newKeepout.unsetIsEditing();
  newKeepoutList.splice(state.linkedKeepoutIndex, 1, newKeepout);
  return {
    ...state,
    keepoutList: newKeepoutList,
    linkedKeepoutIndex: null,
    drawingKeepoutPolyline: null,
    fixedPoints: [],
    auxPolyline: null,
    startPointAuxPolyline: null,
  };
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
    [
      ...existPoints,
      Point.fromCoordinate(fixedDest, null, null, null, Cesium.Color.YELLOW)
    ],
    null,
    null,
    Cesium.Color.YELLOW
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
        [
          ...existPoints,
          Point.fromCoordinate(
            intersection, null, null, null, Cesium.Color.YELLOW
          )
        ],
        null,
        null,
        Cesium.Color.YELLOW
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
    drawingKeepoutPolyline: polyline,
    fixedPoints: existPoints,
    auxPolyline: auxPolyline,
    startPointAuxPolyline: startPointAuxPolyline
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
  const polyline = new FoundLine(
    [...existPoints, existPoints[0]], null, null, Cesium.Color.YELLOW
  );

  const updateKeepout = NormalKeepout.fromKeepout(
    state.keepoutList[state.linkedKeepoutIndex]
  );
  updateKeepout.setFinishedDrawing();

  const newKeepoutList = [...state.keepoutList];
  newKeepoutList.splice(state.linkedKeepoutIndex, 1, updateKeepout)
  return {
    ...state,
    keepoutList: newKeepoutList,
    drawingKeepoutPolyline: polyline,
    fixedPoints: [],
    auxPolyline: null,
    startPointAuxPolyline: null
  };
}

const setHoverPolyline = (state, action) => {
  const newPolyline = FoundLine.fromPolyline(state.drawingKeepoutPolyline);
  newPolyline.setColor(Cesium.Color.ORANGE);
  return {
    ...state,
    drawingKeepoutPolyline: newPolyline,
    hoverPolyline: true
  };
};

const releaseHoverPolyline = (state, action) => {
  const newPolyline = FoundLine.fromPolyline(state.drawingKeepoutPolyline);
  newPolyline.setColor(Cesium.Color.YELLOW);
  return {
    ...state,
    drawingKeepoutPolyline: newPolyline,
    hoverPolyline: false
  };
};

const setHoverPointIndex = (state, action) => {
  const newPolyline = FoundLine.fromPolyline(state.drawingKeepoutPolyline);
  newPolyline.points[action.hoverPointIndex].setColor(Cesium.Color.ORANGE);
  return {
    ...state,
    drawingKeepoutPolyline: newPolyline,
    hoverPointIndex: action.hoverPointIndex
  };
};

const releaseHoverPointIndex = (state, action) => {
  const newPolyline = FoundLine.fromPolyline(state.drawingKeepoutPolyline);
  newPolyline.points[state.hoverPointIndex].setColor(Cesium.Color.YELLOW);
  return {
    ...state,
    drawingKeepoutPolyline: newPolyline,
    hoverPointIndex: null
  };
};

const complementPointOnPolyline = (state, action) => {
  const indexToAdd = state.drawingKeepoutPolyline.determineAddPointPosition(
    action.rightClickCartesian3
  );
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(action.rightClickCartesian3, 0.05), null, null, null,
    Cesium.Color.YELLOW
  );
  const newPolyline = FoundLine.fromPolyline(state.drawingKeepoutPolyline);
  newPolyline.addPointPrecision(indexToAdd, newPoint)
  return {
    ...state,
    drawingKeepoutPolyline: newPolyline
  };
};

const deletePointOnPolyline = (state, action) => {
  const newPolyline = FoundLine.fromPolyline(state.drawingKeepoutPolyline);
  newPolyline.deletePoint(state.hoverPointIndex)
  return {
    ...state,
    drawingKeepoutPolyline: newPolyline,
  };
};

const setKeepoutPickedPointIndex = (state, action) => {
  return {
    ...state,
    pickedPointIndex: action.pickedPointIndex,
  };
};

const moveKeepoutPickedPoint = (state, action) => {
  const newPolyline = FoundLine.fromPolyline(state.drawingKeepoutPolyline);
  newPolyline.points[state.pickedPointIndex].setCartesian3Coordinate(
    action.cartesian3, 0.05
  );
  return {
    ...state,
    drawingKeepoutPolyline: newPolyline
  }
};

const releaseKeepoutPickedPointIndex = (state, action) => {
  return {
    ...state,
    pickedPointIndex: null,
    brngCollection:
      new BearingCollection(state.drawingKeepoutPolyline.getHelpLineBearings())
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_KEEPOUT:
      return createKeepout (state, action);
    case actionTypes.UPDATE_KEEPOUT:
      return updateKeepout (state, action);
    case actionTypes.DELETE_KEEPOUT:
      return deleteKeepout (state, action);
    case actionTypes.INIT_LINKED_KEEPOUT_INDEX:
      return initLinkedKeepoutIndex (state, action);
    case actionTypes.RELEASE_LINKED_KEEPOUT_INDEX:
      return releaseLinkedKeepoutIndex (state, action);
    case actionTypes.KEEPOUT_ADD_POINT:
      return addPointOnKeepoutPolyline (state, action);
    case actionTypes.KEEPOUT_DRAG_POLYLINE:
      return dragKeepoutPolyline (state, action);
    case actionTypes.KEEPOUT_DRAG_POLYLINE_FIXED_MODE:
      return dragPolylineFixedMode (state, action);
    case actionTypes.KEEPOUT_TERMINATE_DRAWING:
      return terminateKeepoutDrawing (state, action);
    case actionTypes.SET_KEEPOUT_HOVERPOLYLINE:
      return setHoverPolyline (state, action);
    case actionTypes.RELEASE_KEEPOUT_HOVERPOLYLINE:
      return releaseHoverPolyline (state, action);
    case actionTypes.SET_KEEPOUT_HOVERPOINT:
      return setHoverPointIndex (state, action);
    case actionTypes.RELEASE_KEEPOUT_HOVERPOINT:
      return releaseHoverPointIndex (state, action);
    case actionTypes.CLICK_COMPLEMENT_POINT_ON_KEEPOUT_POLYLINE:
      return complementPointOnPolyline (state, action);
    case actionTypes.CLICK_DELETE_POINT_ON_KEEPOUT_POLYLINE:
      return deletePointOnPolyline (state, action);
    case actionTypes.SET_KEEPOUT_PICKEDPOINT:
      return setKeepoutPickedPointIndex (state, action);
    case actionTypes.MOVE_KEEPOUT_PICKEDPOINT:
      return moveKeepoutPickedPoint (state, action);
    case actionTypes.RELEASE_KEEPOUT_PICKEDPOINT:
      return releaseKeepoutPickedPointIndex (state, action);
    case actionTypes.DO_NOTHING:
      return state;
    default: return state;
  }
};

export default reducer;
