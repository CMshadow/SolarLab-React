import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Point from '../../infrastructure/point/point';
import Polyline from '../../infrastructure/line/polyline';
import InnerLine from '../../infrastructure/line/innerLine';

const initialState = {
  drawingInnerPolyline: null,
  fixedInnerPolylines: [],
  pointsRelation: {},

  hoverInnerLineIndex: null,
  hoverInnerPointId: null,
};

const passFoundPolyline = (state, action) => {
  console.log('[passFoundPolyline]')
  const polylineArray = action.foundPolyline.getSegmentPolyline();
  return {
    ...state,
    pointsRelation: action.foundPolyline.points.reduce((map, point) => {
      map[point.entityId] = {
        object: point,
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

const addStartPoint = (state, action) => {
  console.log('[addStartPoint]')
  let newPoint = null;
  if (action.cartesian3) {
    if (action.foundAddPointPosition) {
      newPoint = Point.fromCoordinate(
        Coordinate.fromCartesian(action.cartesian3, 0.05),null,null,null,null,null,null,false
      );
    } else {
      newPoint = Point.fromCoordinate(
        Coordinate.fromCartesian(action.cartesian3, 0.05)
      );
    }
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
  } else {
    newPoint = Point.fromPoint(
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
};

const dragDrawingInnerPolyline = (state, action) => {
  const newPolyline = InnerLine.fromPolyline(state.drawingInnerPolyline)
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(action.cartesian3, 0.05)
  );
  newPolyline.updatePoint(1, newPoint);
  return {
    ...state,
    drawingInnerPolyline: newPolyline,
  };
}

const addEndPoint = (state, action) => {
  console.log('[addEndPoint]')
  const newFixedInnerPolyline = state.fixedInnerPolylines.map(elem => {
    return InnerLine.fromPolyline(elem);
  })
  const newPolyline = InnerLine.fromPolyline(state.drawingInnerPolyline);
  let newPoint = null;
  if (action.cartesian3) {
    newPoint = Point.fromCoordinate(
      Coordinate.fromCartesian(action.cartesian3, 0.05)
    );
    newPolyline.updatePoint(1, newPoint);
    return {
      ...state,
      fixedInnerPolylines: [...newFixedInnerPolyline, newPolyline],
      drawingInnerPolyline: null,
      pointsRelation: {
        ...state.pointsRelation,
        [newPoint.entityId]: {
          object: newPoint,
          connectPolyline: [newPolyline]
        }
      }
    };
  } else {
    newPoint = Point.fromPoint(
      action.point, null, null, null, null, null, null, null, null, null, false
    );
    newPolyline.updatePoint(1, newPoint);
    const pointId = action.point.entityId;
    return {
      ...state,
      fixedInnerPolylines: [...newFixedInnerPolyline, newPolyline],
      drawingInnerPolyline: null,
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
  return {
    ...state,
    hoverInnerLineIndex: action.hoverInnerLineIndex
  };
};

const releaseHoverInnerLine = (state, action) => {
  return {
    ...state,
    hoverInnerLineIndex: null
  };
};

const setHoverInnerPoint = (state, action) => {
  return {
    ...state,
    hoverInnerPointId: action.hoverInnerPointId
  };
};

const releaseHoverInnerPoint = (state, action) => {
  return {
    ...state,
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
  console.log(cleanedPointsRelation)
  return {
    ...state,
    fixedInnerPolylines: newFixedInnerPolylines,
    pointsRelation: cleanedPointsRelation
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.PASS_FOUND_POLYLINE:
      return passFoundPolyline (state, action);
    case actionTypes.ADD_START_POINT:
      return addStartPoint (state, action);
    case actionTypes.DRAG_INNER_POLYLINE:
      return dragDrawingInnerPolyline (state, action);
    case actionTypes.ADD_END_POINT:
      return addEndPoint (state, action);
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
