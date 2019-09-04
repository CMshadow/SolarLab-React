import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Point from '../../infrastructure/point/point';
import Polyline from '../../infrastructure/line/polyline';
import InnerLine from '../../infrastructure/line/innerLine';

const initialState = {
  foundPolyline: null,
  drawingInnerPolyline: null,
  fixedInnerPolylines: [],
  pointsRelation: {},

  mouseCartesian3: null,
  hoverPolyline: false,
  hoverPointIndex: null,
  pickedPointIndex: null
};

const passFoundPolyline = (state, action) => {
  console.log('[passFoundPolyline]')
  return {
    ...state,
    foundPolyline: action.foundPolyline,
    pointsRelation: action.foundPolyline.points.reduce((map, obj) => {
      map[obj.entityId] = {
        object: obj,
        connectPolyline: []
      };
      return map;
    }, {})
  };
};

const addStartPoint = (state, action) => {
  console.log('[addStartPoint]')
  let newPoint = null;
  if (action.cartesian3) {
    newPoint = Point.fromCoordinate(
      Coordinate.fromCartesian(action.cartesian3, 0.1)
    );
    const newPolyline = new InnerLine([newPoint]);
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
    const newPolyline = new InnerLine([newPoint]);
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

const dragDrawingInnerPolyline = (sstate, action) => {

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
      Coordinate.fromCartesian(action.cartesian3, 0.1)
    );
    newPolyline.addPointTail(newPoint);
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
    newPolyline.addPointTail(newPoint);
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

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.PASS_FOUND_POLYLINE:
      return passFoundPolyline (state, action);
    case actionTypes.ADD_START_POINT:
      return addStartPoint (state, action);
    case actionTypes.ADD_END_POINT:
      return addEndPoint (state, action);
    default: return state;
  }
};

export default reducer;
