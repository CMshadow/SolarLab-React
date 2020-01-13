import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import {
  createAuxPolyline,
  findTwoAuxPolylineIntersect
} from './drawingManager';
import Coordinate from '../../infrastructure/point/coordinate';
import Point from '../../infrastructure/point/point';
import Polyline from '../../infrastructure/line/polyline';
import Sector from '../../infrastructure/line/sector';
import Circle from '../../infrastructure/line/circle';
import FoundLine from '../../infrastructure/line/foundLine';
import DashedLine from '../../infrastructure/line/dashedLine';
import BearingCollection from '../../infrastructure/math/bearingCollection';
import NormalKeepout from '../../infrastructure/keepout/normalKeepout';
import Passage from '../../infrastructure/keepout/passage';
import Vent from '../../infrastructure/keepout/vent';
import Tree from '../../infrastructure/keepout/tree';
import Env from '../../infrastructure/keepout/env';

const initialState = {
  keepoutList: [],
  linkedKeepoutIndex: null,
  linkedKeepoutType: null,
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

  let newKeepout = null;
  switch (action.keepoutType) {
    default:
    case 'KEEPOUT':
      newKeepout = NormalKeepout.fromKeepout(
        newKeepoutList[action.keepoutIndex]
      );
      break;

    case 'PASSAGE':
      newKeepout = Passage.fromKeepout(
        newKeepoutList[action.keepoutIndex]
      );
      break;

    case 'VENT':
      newKeepout = Vent.fromKeepout(
        newKeepoutList[action.keepoutIndex]
      );
      break;

    case 'TREE':
      newKeepout = Tree.fromKeepout(
        newKeepoutList[action.keepoutIndex]
      );
      break;

    case 'Env':
      newKeepout = Env.fromKeepout(
        newKeepoutList[action.keepoutIndex]
      );
      break;
  }

  newKeepout.setIsEditing();
  newKeepoutList.splice(action.keepoutIndex, 1, newKeepout);
  const readPolyline =
    newKeepout.finishedDrawing ? newKeepout.outlinePolyline : null;
  return {
    ...state,
    drawingKeepoutPolyline: readPolyline,
    keepoutList: newKeepoutList,
    linkedKeepoutIndex: action.keepoutIndex,
    linkedKeepoutType: action.keepoutType
  };
};

const releaseLinkedKeepoutIndex = (state, action) => {
  const newKeepoutList = [...state.keepoutList];

  let newKeepout = null;
  switch (state.keepoutList[state.linkedKeepoutIndex].type) {
    default:
    case 'KEEPOUT':
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
      break;

    case 'PASSAGE':
      if (newKeepoutList[state.linkedKeepoutIndex].finishedDrawing) {
        newKeepout = Passage.fromKeepout(
          newKeepoutList[state.linkedKeepoutIndex], null,
          Polyline.fromPolyline(state.drawingKeepoutPolyline)
        );
      } else {
        newKeepout = Passage.fromKeepout(
          newKeepoutList[state.linkedKeepoutIndex]
        );
      }
      break;

    case 'VENT' :
      if (newKeepoutList[state.linkedKeepoutIndex].finishedDrawing) {
        newKeepout = Vent.fromKeepout(
          newKeepoutList[state.linkedKeepoutIndex],
          parseFloat(state.drawingKeepoutPolyline.brng.toFixed(1)),
          parseFloat(state.drawingKeepoutPolyline.radius.toFixed(1)),
          parseFloat(state.drawingKeepoutPolyline.angle.toFixed(1)),
          Sector.fromPolyline(state.drawingKeepoutPolyline)
        );
      } else {
        newKeepout = Vent.fromKeepout(
          newKeepoutList[state.linkedKeepoutIndex]
        );
      }
      break;

    case 'TREE':
      if (newKeepoutList[state.linkedKeepoutIndex].finishedDrawing) {
        newKeepout = Tree.fromKeepout(
          newKeepoutList[state.linkedKeepoutIndex],
          null,
          parseFloat(state.drawingKeepoutPolyline.radius.toFixed(1)),
          Circle.fromPolyline(state.drawingKeepoutPolyline)
        );
      } else {
        newKeepout = Tree.fromKeepout(
          newKeepoutList[state.linkedKeepoutIndex]
        );
      }
      break;

    case 'ENV':
      if (newKeepoutList[state.linkedKeepoutIndex].finishedDrawing) {
        newKeepout = Env.fromKeepout(
          newKeepoutList[state.linkedKeepoutIndex], null,
          FoundLine.fromPolyline(state.drawingKeepoutPolyline)
        );
      } else {
        newKeepout = NormalKeepout.fromKeepout(
          newKeepoutList[state.linkedKeepoutIndex]
        );
      }
      break;
  };

  newKeepout.unsetIsEditing();
  newKeepoutList.splice(state.linkedKeepoutIndex, 1, newKeepout);
  return {
    ...state,
    keepoutList: newKeepoutList,
    linkedKeepoutIndex: null,
    linkedKeepoutType: null,
    drawingKeepoutPolyline: null,
    fixedPoints: [],
    auxPolyline: null,
    startPointAuxPolyline: null,
  };
};

const dragKeepoutPolyline = (state, action) => {
  const existPoints = state.fixedPoints.map(elem => {
    return Point.fromPoint(elem);
  });

  let newPoint = null;
  let polyline = null
  switch (state.keepoutList[state.linkedKeepoutIndex].type) {
    default:
    case 'ENV':
    case 'KEEPOUT':
      newPoint = Point.fromCoordinate(
        Coordinate.fromCartesian(action.cartesian3, 0.05), null, null, null,
        Cesium.Color.YELLOW
      );
      polyline = new FoundLine(
        [...existPoints, newPoint], null, null, Cesium.Color.YELLOW
      );
      break;

    case 'PASSAGE':
      newPoint = Point.fromCoordinate(
        Coordinate.fromCartesian(action.cartesian3, 0.05), null, null, null,
        Cesium.Color.WHEAT
      );
      polyline = new Polyline(
        [...existPoints, newPoint], null, null, Cesium.Color.WHEAT
      );
      break;
  }
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

  const intersectionMinDist = 1;
  let auxPolyline = null;
  let startPointAuxPolyline = null;
  let intersection = null;
  let intersectionCheck = false;

  if (existPoints.length >= 2) {
    intersection = findTwoAuxPolylineIntersect(state, existPoints, fixedDest);
    if (
      Coordinate.surfaceDistance(intersection, newPoint) < intersectionMinDist
    ) {
      intersectionCheck = true;
      auxPolyline = new DashedLine(
        [existPoints[existPoints.length-1], Point.fromCoordinate(intersection)]
      );
      startPointAuxPolyline =new DashedLine(
        [existPoints[0], Point.fromCoordinate(intersection)]
      );
    } else {
      auxPolyline =
        createAuxPolyline(state, existPoints[existPoints.length-1], newPoint);
      startPointAuxPolyline =
        createAuxPolyline(state, existPoints[0], newPoint);
    }
  }

  let polyline = null;
  switch (state.keepoutList[state.linkedKeepoutIndex].type) {
    default:
    case 'ENV':
    case 'KEEPOUT':
      if (intersectionCheck) {
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
        polyline = new FoundLine(
          [
            ...existPoints,
            Point.fromCoordinate(fixedDest, null, null, null, Cesium.Color.YELLOW)
          ],
          null,
          null,
          Cesium.Color.YELLOW
        );
      }
      break;

    case 'PASSAGE':
      if (intersectionCheck) {
        polyline = new Polyline(
          [
            ...existPoints,
            Point.fromCoordinate(
              intersection, null, null, null, Cesium.Color.WHEAT
            )
          ],
          null,
          null,
          Cesium.Color.WHEAT
        );
      } else {
        polyline = new Polyline(
          [
            ...existPoints,
            Point.fromCoordinate(fixedDest, null, null, null, Cesium.Color.WHEAT)
          ],
          null,
          null,
          Cesium.Color.WHEAT
        );
      }
      break;
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
  let newPoint = Point.fromCoordinate(
    state.drawingKeepoutPolyline.points[state.drawingKeepoutPolyline.length-1],
    null, null, null,
    state.drawingKeepoutPolyline.points[state.drawingKeepoutPolyline.length-1]
    .color
  );
  const trailingPoint = Point.fromCoordinate(
    state.drawingKeepoutPolyline.points[state.drawingKeepoutPolyline.length-1],
    null, null, null,
    state.drawingKeepoutPolyline.points[state.drawingKeepoutPolyline.length-1]
    .color
  );

  let polyline = null;
  switch (state.keepoutList[state.linkedKeepoutIndex].type) {
    default:
    case 'ENV':
    case 'KEEPOUT':
      polyline = new FoundLine(
        [...existPoints, newPoint, trailingPoint], null, null,
        Cesium.Color.YELLOW
      );
      break;

    case 'PASSAGE':
      polyline = new Polyline(
        [...existPoints, newPoint, trailingPoint], null, null,
        Cesium.Color.WHEAT
      );
      break;
  }

  return {
    ...state,
    drawingKeepoutPolyline: polyline,
    fixedPoints: [...existPoints, newPoint],
    brngCollection: new BearingCollection(polyline.getHelpLineBearings())
  };
};

const addVentTemplate = (state, action) => {
  const sectorPolyline = Sector.fromProps(
    Coordinate.fromCartesian(action.cartesian3, 0.05),
    state.keepoutList[state.linkedKeepoutIndex].bearing,
    state.keepoutList[state.linkedKeepoutIndex].radius,
    state.keepoutList[state.linkedKeepoutIndex].angle,
    null,
    null,
    Cesium.Color.CADETBLUE
  );
  const updateKeepout = Vent.fromKeepout(
    state.keepoutList[state.linkedKeepoutIndex]
  );
  updateKeepout.setFinishedDrawing();
  const newKeepoutList = [...state.keepoutList];
  newKeepoutList.splice(state.linkedKeepoutIndex, 1, updateKeepout)
  return {
    ...state,
    keepoutList: newKeepoutList,
    drawingKeepoutPolyline: sectorPolyline
  }
};

const addTreeTemplate = (state, action) => {
  const circlePolyline = Circle.fromProps(
    Coordinate.fromCartesian(action.cartesian3, 0.05),
    state.keepoutList[state.linkedKeepoutIndex].radius,
    null,
    null,
    Cesium.Color.FORESTGREEN
  );
  const updateKeepout = Tree.fromKeepout(
    state.keepoutList[state.linkedKeepoutIndex]
  );
  updateKeepout.setFinishedDrawing();
  const newKeepoutList = [...state.keepoutList];
  newKeepoutList.splice(state.linkedKeepoutIndex, 1, updateKeepout)
  return {
    ...state,
    keepoutList: newKeepoutList,
    drawingKeepoutPolyline: circlePolyline
  }
};

const terminateKeepoutDrawing = (state, action) => {
  const existPoints = state.fixedPoints.map(elem => {
    return Point.fromPoint(elem);
  });

  let polyline = null;
  let updateKeepout = null;
  switch (state.keepoutList[state.linkedKeepoutIndex].type) {
    default:
    case 'KEEPOUT':
      polyline = new FoundLine(
        [...existPoints, existPoints[0]], null, null, Cesium.Color.YELLOW
      );
      updateKeepout = NormalKeepout.fromKeepout(
        state.keepoutList[state.linkedKeepoutIndex]
      );
      break;

    case 'PASSAGE':
      polyline = new Polyline(
        [...existPoints], null, null, Cesium.Color.WHEAT
      );
      updateKeepout = Passage.fromKeepout(
        state.keepoutList[state.linkedKeepoutIndex]
      );
      break;

    case 'ENV':
      polyline = new FoundLine(
        [...existPoints, existPoints[0]], null, null, Cesium.Color.YELLOW
      );
      updateKeepout = Env.fromKeepout(
        state.keepoutList[state.linkedKeepoutIndex]
      );
      break;
  }

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
};

const setHoverPolyline = (state, action) => {
  let newPolyline = null;
  switch (state.keepoutList[state.linkedKeepoutIndex].type) {
    default:
    case 'ENV':
    case 'KEEPOUT':
      newPolyline = FoundLine.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.setColor(Cesium.Color.ORANGE);
      break;

    case 'PASSAGE':
      newPolyline = Polyline.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.setColor(Cesium.Color.ORANGE);
      break;

    case 'VENT':
      newPolyline = Sector.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.setColor(Cesium.Color.ORANGE);
      break;

    case 'TREE':
      newPolyline = Circle.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.setColor(Cesium.Color.ORANGE);
      break;
  }
  return {
    ...state,
    drawingKeepoutPolyline: newPolyline,
    hoverPolyline: true
  };
};

const releaseHoverPolyline = (state, action) => {
  let newPolyline = null;
  switch (state.keepoutList[state.linkedKeepoutIndex].type) {
    default:
    case 'ENV':
    case 'KEEPOUT':
      newPolyline = FoundLine.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.setColor(Cesium.Color.YELLOW);
      break;

    case 'PASSAGE':
      newPolyline = Polyline.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.setColor(Cesium.Color.WHEAT);
      break;

    case 'VENT':
      newPolyline = Sector.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.setColor(Cesium.Color.CADETBLUE);
      break;

    case 'TREE':
      newPolyline = Circle.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.setColor(Cesium.Color.FORESTGREEN);
      break;
  }
  return {
    ...state,
    drawingKeepoutPolyline: newPolyline,
    hoverPolyline: false
  };
};

const setHoverPointIndex = (state, action) => {
  let newPolyline = null;
  switch (state.keepoutList[state.linkedKeepoutIndex].type) {
    default:
    case 'ENV':
    case 'KEEPOUT':
      newPolyline = FoundLine.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.points[action.hoverPointIndex].setColor(Cesium.Color.ORANGE);
      break;

    case 'PASSAGE':
      newPolyline = Polyline.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.points[action.hoverPointIndex].setColor(Cesium.Color.ORANGE);
      break;

    case 'VENT':
      newPolyline = Sector.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.points[action.hoverPointIndex].setColor(Cesium.Color.ORANGE);
      break;

    case 'TREE':
      newPolyline = Circle.fromPolyline(state.drawingKeepoutPolyline);
      if (action.hoverPointIndex === 'centerPoint') {
        newPolyline.centerPoint.setColor(Cesium.Color.ORANGE);
      } else {
        newPolyline.points[action.hoverPointIndex].setColor(Cesium.Color.ORANGE);
      }
      break;
  }
  return {
    ...state,
    drawingKeepoutPolyline: newPolyline,
    hoverPointIndex: action.hoverPointIndex
  };
};

const releaseHoverPointIndex = (state, action) => {
  let newPolyline = null;
  console.log(state.hoverPointIndex)
  switch (state.keepoutList[state.linkedKeepoutIndex].type) {
    default:
    case 'ENV':
    case 'KEEPOUT':
      newPolyline = FoundLine.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.points[state.hoverPointIndex].setColor(Cesium.Color.YELLOW);
      break;

    case 'PASSAGE':
      newPolyline = Polyline.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.points[state.hoverPointIndex].setColor(Cesium.Color.WHEAT);
      break;

    case 'VENT':
      newPolyline = Sector.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.points[state.hoverPointIndex].setColor(Cesium.Color.CADETBLUE);
      break;

    case 'TREE':
      newPolyline = Circle.fromPolyline(state.drawingKeepoutPolyline);
      if (state.hoverPointIndex === 'centerPoint') {
        newPolyline.centerPoint.setColor(Cesium.Color.FORESTGREEN);
      } else {
        newPolyline.points[state.hoverPointIndex].setColor(Cesium.Color.FORESTGREEN);
      }
      break;
  }
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

  let newPoint = null;
  let newPolyline = null;
  switch (state.keepoutList[state.linkedKeepoutIndex].type) {
    default:
    case 'ENV':
    case 'KEEPOUT':
      newPoint = Point.fromCoordinate(
        Coordinate.fromCartesian(action.rightClickCartesian3, 0.05), null, null, null,
        Cesium.Color.YELLOW
      );
      newPolyline = FoundLine.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.addPointPrecision(indexToAdd, newPoint)
      break;

    case 'PASSAGE':
      newPoint = Point.fromCoordinate(
        Coordinate.fromCartesian(action.rightClickCartesian3, 0.05), null, null, null,
        Cesium.Color.WHEAT
      );
      newPolyline = Polyline.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.addPointPrecision(indexToAdd, newPoint)
      break;
  }

  return {
    ...state,
    drawingKeepoutPolyline: newPolyline
  };
};

const deletePointOnPolyline = (state, action) => {
  let newPolyline = null;
  switch (state.keepoutList[state.linkedKeepoutIndex].type) {
    default:
    case 'ENV':
    case 'KEEPOUT':
      newPolyline = FoundLine.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.deletePoint(state.hoverPointIndex)
      break;

    case 'PASSAGE':
      newPolyline = Polyline.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.deletePoint(state.hoverPointIndex)
      break;
  }
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
  let newPolyline = null;
  switch (state.keepoutList[state.linkedKeepoutIndex].type) {
    default:
    case 'ENV':
    case 'KEEPOUT':
      newPolyline = FoundLine.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.points[state.pickedPointIndex].setCartesian3Coordinate(
        action.cartesian3, 0.05
      );
      break;

    case 'PASSAGE':
      newPolyline = Polyline.fromPolyline(state.drawingKeepoutPolyline);
      newPolyline.points[state.pickedPointIndex].setCartesian3Coordinate(
        action.cartesian3, 0.05
      );
      break;

    case 'VENT':
      switch (state.pickedPointIndex) {
        default:
        case 0:
          newPolyline = Sector.fromPolyline(state.drawingKeepoutPolyline);
          newPolyline.updateOriginCor(
            Coordinate.fromCartesian(action.cartesian3, 0.05)
          );
          break;

        case 1: {
          const bearing = Coordinate.bearing(
            state.drawingKeepoutPolyline.points[0],
            Coordinate.fromCartesian(action.cartesian3, 0.05)
          );
          newPolyline = Sector.fromPolyline(state.drawingKeepoutPolyline);
          newPolyline.updateAngle(bearing);
          break;
        }

        case Math.trunc(state.drawingKeepoutPolyline.points.length/2):
          const newRadius = Coordinate.surfaceDistance(
            state.drawingKeepoutPolyline.points[0],
            Coordinate.fromCartesian(action.cartesian3, 0.05)
          );
          newPolyline = Sector.fromPolyline(state.drawingKeepoutPolyline);
          newPolyline.updateRadius(newRadius);
          break;

        case state.drawingKeepoutPolyline.points.length-2: {
          const bearing = Coordinate.bearing(
            state.drawingKeepoutPolyline.points[0],
            Coordinate.fromCartesian(action.cartesian3, 0.05)
          );
          newPolyline = Sector.fromPolyline(state.drawingKeepoutPolyline);
          newPolyline.updateBearing(bearing);
          break;
        }
      }
      break;

    case 'TREE':
      switch (state.pickedPointIndex) {
        case 0:
          const newRadius = Coordinate.surfaceDistance(
            state.drawingKeepoutPolyline.centerPoint,
            Coordinate.fromCartesian(action.cartesian3, 0.05)
          );
          newPolyline = Circle.fromPolyline(state.drawingKeepoutPolyline);
          newPolyline.updateRadius(newRadius);
          break;

        default:
        case 'centerPoint':
          newPolyline = Circle.fromPolyline(state.drawingKeepoutPolyline);
          newPolyline.updateCenterPoint(
            Coordinate.fromCartesian(action.cartesian3, 0.05)
          );
          break;
      }
      break;
  }
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
    case actionTypes.KEEPOUT_ADD_VENT_TEMPLATE:
      return addVentTemplate (state, action);
    case actionTypes.KEEPOUT_ADD_TREE_TEMPLATE:
      return addTreeTemplate (state, action);
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
