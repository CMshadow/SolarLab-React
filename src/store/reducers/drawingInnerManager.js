import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Point from '../../infrastructure/point/point';
import InnerLine from '../../infrastructure/line/innerLine';
import { createAuxPolyline } from './drawingManager';

const initialState = {
  drawingInnerPolyline: null,
  fixedInnerPolylines: [],
  pointsRelation: {},
  brngCollection: null,
  auxPolyline: null,

  hoverInnerLineIndex: null,
  hoverInnerPointId: null,
};

const passFoundPolyline = (state, action) => {
  const polylineArray = action.foundPolyline.getSegmentPolyline();
  return {
    ...state,
    brngCollection: action.brngCollection,
    pointsRelation: action.foundPolyline.points.reduce((map, point) => {
      map[point.entityId] = {
        object: Point.fromPoint(point),
        connectPolyline: polylineArray.reduce((acc, line) => {
          if (
            line.points[0].entityId === point.entityId ||
            line.points[1].entityId === point.entityId
          ) {
            acc.push(line)
          }
          return acc;
        }, [])
      };
      return map;
    }, {})
  };
};

const updatePointsRelation = (state, action) => {
  const polylineArray = action.foundPolyline.getSegmentPolyline();
  const newPointsRelation = action.foundPolyline.points.reduce((map, point) => {
    map[point.entityId] = {
      object: Point.fromPoint(point),
      connectPolyline: polylineArray.reduce((acc, line) => {
        if (
          line.points[0].entityId === point.entityId ||
          line.points[1].entityId === point.entityId
        ) {
          acc.push(line)
        }
        return acc;
      }, [])
    };
    return map;
  }, {})
  const complementPointsRelation = state.fixedInnerPolylines.flatMap(polyline => {
    return polyline.points.map(point => {
      return {
        [point.entityId]: {
          object: point,
          connectPolyline: [polyline]
        }
      }
    })
  })
  for (let obj of complementPointsRelation) {
    if (Object.keys(obj)[0] in newPointsRelation) {
      newPointsRelation[Object.keys(obj)[0]].connectPolyline.push(
        Object.values(obj)[0].connectPolyline[0]
      );
    } else {
      newPointsRelation[Object.keys(obj)[0]] = Object.values(obj)[0];
    }
  }
  return {
    ...state,
    pointsRelation: newPointsRelation
  };
};

const addStartPointOnExist = (state, action) => {
  const newPoint = Point.fromPoint(
    action.point, null, null, null, null, null, null, null, null, null, false
  );
  const newPolyline = new InnerLine(
    [newPoint], null, null, Cesium.Color.DARKGRAY
  );
  const pointId = action.point.entityId;
  return {
    ...state,
    drawingInnerPolyline: newPolyline,
    pointsRelation: {
      ...state.pointsRelation,
      [pointId]:{
        ...state.pointsRelation[pointId],
        connectPolyline: [
          ...state.pointsRelation[pointId].connectPolyline, newPolyline
        ]
      }
    }
  };
}

const addStartPointOnNew = (state, action) => {
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(action.cartesian3, 0.05)
  );
  const newPolyline = new InnerLine(
    [newPoint], null, null, Cesium.Color.DARKGRAY
  );
  return {
    ...state,
    drawingInnerPolyline: newPolyline,
    pointsRelation: {
      ...state.pointsRelation,
      [newPoint.entityId]: {
        object: newPoint,
        connectPolyline: [newPolyline]
      }
    }
  };
}

const addStartPointOnFoundPolyline = (state, action) => {
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(action.cartesian3, 0.05), null, action.uniqueId
  );
  const newPolyline = new InnerLine(
    [newPoint], null, null, Cesium.Color.DARKGRAY
  );
  return {
    ...state,
    drawingInnerPolyline: newPolyline,
    pointsRelation: {
      ...state.pointsRelation,
      [newPoint.entityId]: {
        object: newPoint,
        connectPolyline: [newPolyline]
      }
    }
  };
}

const addStartPoint = (state, action) => {
  if (action.cartesian3) {
    return addStartPointOnNew (state, action);
  } else {
    return addStartPointOnExist (state, action);
  }
};

const dragDrawingInnerPolyline = (state, action) => {
  const newPolyline = InnerLine.fromPolyline(state.drawingInnerPolyline)
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(action.cartesian3, 0.05)
  );
  newPolyline.updatePoint(1, newPoint);
  // Create Aux polyline
  const auxPolyline =
    createAuxPolyline(state, newPolyline.points[0], newPoint);
  return {
    ...state,
    drawingInnerPolyline: newPolyline,
    auxPolyline: auxPolyline
  };
}

const dragDrawingInnerPolylineFixedMode = (state, action) => {
  const newPolyline = InnerLine.fromPolyline(state.drawingInnerPolyline)
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(action.cartesian3, 0.05)
  );
  const mouseBrng = Coordinate.bearing(
    newPolyline.points[0], newPoint
  );
  const closestBrng = state.brngCollection.findClosestBrng(mouseBrng);
  const fixedDest = Coordinate.destination(
    newPolyline.points[0],
    closestBrng,
    Math.cos(Cesium.Math.toRadians(closestBrng-mouseBrng)) *
    Coordinate.surfaceDistance(newPolyline.points[0], newPoint)
  );
  newPolyline.updatePoint(1, Point.fromCoordinate(fixedDest));
  // Create Aux polyline
  const auxPolyline =
    createAuxPolyline(state, newPolyline.points[0], newPoint);
  return {
    ...state,
    drawingInnerPolyline: newPolyline,
    auxPolyline: auxPolyline
  };
}

const addEndPointOnExist = (state, action) => {
  const newFixedInnerPolyline = state.fixedInnerPolylines.map(elem => {
    return InnerLine.fromPolyline(elem);
  })
  const newPolyline = InnerLine.fromPolyline(state.drawingInnerPolyline);
  const newPoint = Point.fromPoint(
    action.point, null, null, null, null, null, null, null, null, null, false
  );
  newPolyline.updatePoint(1, newPoint);
  const pointId = action.point.entityId;
  return {
    ...state,
    fixedInnerPolylines: [...newFixedInnerPolyline, newPolyline],
    drawingInnerPolyline: null,
    auxPolyline: null,
    pointsRelation: {
      ...state.pointsRelation,
      [pointId]:{
        ...state.pointsRelation[pointId],
        connectPolyline: [
          ...state.pointsRelation[pointId].connectPolyline, newPolyline
        ]
      }
    }
  };
}

const addEndPointOnNew = (state, action) => {
  const newFixedInnerPolyline = state.fixedInnerPolylines.map(elem => {
    return InnerLine.fromPolyline(elem);
  })
  const newPolyline = InnerLine.fromPolyline(state.drawingInnerPolyline);
  const newPoint = Point.fromPoint(newPolyline.points[1]);
  newPolyline.updatePoint(1, newPoint);
  return {
    ...state,
    fixedInnerPolylines: [...newFixedInnerPolyline, newPolyline],
    drawingInnerPolyline: null,
    auxPolyline: null,
    pointsRelation: {
      ...state.pointsRelation,
      [newPoint.entityId]: {
        object: newPoint,
        connectPolyline: [newPolyline]
      }
    }
  };
}

const addEndPointOnFoundPolyline = (state, action) => {
  const newFixedInnerPolyline = state.fixedInnerPolylines.map(elem => {
    return InnerLine.fromPolyline(elem);
  })
  const newPolyline = InnerLine.fromPolyline(state.drawingInnerPolyline);
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(action.cartesian3, 0.05), null, action.uniqueId
  );
  newPolyline.updatePoint(1, newPoint);
  return {
    ...state,
    fixedInnerPolylines: [...newFixedInnerPolyline, newPolyline],
    drawingInnerPolyline: null,
    auxPolyline: null,
    pointsRelation: {
      ...state.pointsRelation,
      [newPoint.entityId]: {
        object: newPoint,
        connectPolyline: [newPolyline]
      }
    }
  };
}

const addEndPoint = (state, action) => {
  if (action.cartesian3) {
    return addEndPointOnNew(state, action);
  } else {
    return addEndPointOnExist(state, action);
  }
};

const setTypeHip = (state, action) => {
  const newPolyline = InnerLine.fromPolyline(
    state.fixedInnerPolylines[state.hoverInnerLineIndex]
  );
  newPolyline.setTypeHip();
  const newFixedInnerPolyline = [...state.fixedInnerPolylines];
  newFixedInnerPolyline[state.hoverInnerLineIndex] = newPolyline;
  return {
    ...state,
    fixedInnerPolylines: newFixedInnerPolyline
  };
};

const setTypeRidge = (state, action) => {
  const newPolyline = InnerLine.fromPolyline(
    state.fixedInnerPolylines[state.hoverInnerLineIndex]
  );
  newPolyline.setTypeRidge();
  const newFixedInnerPolyline = [...state.fixedInnerPolylines];
  newFixedInnerPolyline[state.hoverInnerLineIndex] = newPolyline;
  return {
    ...state,
    fixedInnerPolylines: newFixedInnerPolyline
  };
};

const setHoverInnerLine = (state, action) => {
  const newPolyline = InnerLine.fromPolyline(
    state.fixedInnerPolylines[action.hoverInnerLineIndex]
  );
  newPolyline.setColor(Cesium.Color.ORANGE);
  const newFixedInnerPolylines = [...state.fixedInnerPolylines];
  newFixedInnerPolylines.splice(action.hoverInnerLineIndex, 1, newPolyline);
  return {
    ...state,
    fixedInnerPolylines: newFixedInnerPolylines,
    hoverInnerLineIndex: action.hoverInnerLineIndex
  };
};

const releaseHoverInnerLine = (state, action) => {
  const newPolyline = InnerLine.fromPolyline(
    state.fixedInnerPolylines[state.hoverInnerLineIndex]
  );
  newPolyline.setColorbyType();
  const newFixedInnerPolylines = [...state.fixedInnerPolylines];
  newFixedInnerPolylines.splice(state.hoverInnerLineIndex, 1, newPolyline);
  return {
    ...state,
    fixedInnerPolylines: newFixedInnerPolylines,
    hoverInnerLineIndex: null
  };
};

const setHoverInnerPoint = (state, action) => {
  const newPoint = Point.fromPoint(
    state.pointsRelation[action.hoverInnerPointId].object
  );
  newPoint.setColor(Cesium.Color.ORANGE);
  return {
    ...state,
    pointsRelation:{
      ...state.pointsRelation,
      [action.hoverInnerPointId]: {
        ...state.pointsRelation[action.hoverInnerPointId],
        object: newPoint
      }
    },
    hoverInnerPointId: action.hoverInnerPointId
  };
};

const releaseHoverInnerPoint = (state, action) => {
  const newPoint = Point.fromPoint(
    state.pointsRelation[state.hoverInnerPointId].object
  );
  newPoint.setColor(Cesium.Color.WHITE);
  return {
    ...state,
    pointsRelation:{
      ...state.pointsRelation,
      [state.hoverInnerPointId]: {
        ...state.pointsRelation[state.hoverInnerPointId],
        object: newPoint
      }
    },
    hoverInnerPointId: null
  };
};

const deleteInnerLine = (state, action) => {
  const deleteInnerLineId =
    state.fixedInnerPolylines[state.hoverInnerLineIndex].entityId;
  const point1Id =
    state.fixedInnerPolylines[state.hoverInnerLineIndex].points[0].entityId;
  const point2Id =
    state.fixedInnerPolylines[state.hoverInnerLineIndex].points[1].entityId;
  const newFixedInnerPolylines = [...state.fixedInnerPolylines];
  newFixedInnerPolylines.splice(state.hoverInnerLineIndex, 1);
  const newPointsRelation = {
    ...state.pointsRelation,
    [point1Id]: {
      ...state.pointsRelation[point1Id],
      connectPolyline: state.pointsRelation[point1Id].connectPolyline.filter(
        elem => elem.entityId !== deleteInnerLineId
      )
    },
    [point2Id]: {
      ...state.pointsRelation[point2Id],
      connectPolyline: state.pointsRelation[point2Id].connectPolyline.filter(
        elem => elem.entityId !== deleteInnerLineId
      )
    }
  };
  const cleanedPointsRelation = Object.keys(newPointsRelation).reduce((object, key) => {
    if (newPointsRelation[key].connectPolyline.length !== 0) {
      object[key] = newPointsRelation[key]
    }
    return object
  }, {})
  return {
    ...state,
    fixedInnerPolylines: newFixedInnerPolylines,
    pointsRelation: cleanedPointsRelation,
    hoverInnerLineIndex: null,
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.PASS_FOUND_POLYLINE:
      return passFoundPolyline (state, action);
    case actionTypes.UPDATE_POINTS_RELATION:
      return updatePointsRelation (state, action);
    case actionTypes.ADD_START_POINT:
      return addStartPoint (state, action);
    case actionTypes.ADD_START_POINT_ON_FOUND:
      return addStartPointOnFoundPolyline (state, action);
    case actionTypes.DRAG_INNER_POLYLINE:
      return dragDrawingInnerPolyline (state, action);
      case actionTypes.DRAG_INNER_POLYLINE_FIXED_MODE:
        return dragDrawingInnerPolylineFixedMode (state, action);
    case actionTypes.ADD_END_POINT:
      return addEndPoint (state, action);
    case actionTypes.ADD_END_POINT_ON_FOUND:
      return addEndPointOnFoundPolyline (state, action);
    case actionTypes.SET_TYPE_HIP:
      return setTypeHip (state, action);
    case actionTypes.SET_TYPE_RIDGE:
      return setTypeRidge (state, action);
    case actionTypes.SET_HOVER_INNER_LINE:
      return setHoverInnerLine (state, action);
    case actionTypes.RELEASE_HOVER_INNER_LINE:
      return releaseHoverInnerLine (state, action);
    case actionTypes.SET_HOVER_INNER_POINT:
      return setHoverInnerPoint (state, action);
    case actionTypes.RELEASE_HOVER_INNER_POINT:
      return releaseHoverInnerPoint (state, action);
    case actionTypes.DELETE_INNER_POLYLINE:
      return deleteInnerLine (state, action);
    default: return state;
  }
};

export default reducer;
