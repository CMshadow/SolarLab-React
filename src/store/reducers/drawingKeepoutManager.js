import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Point from '../../infrastructure/point/point';
import Polyline from '../../infrastructure/line/polyline';
import InnerLine from '../../infrastructure/line/innerLine';


const initialState = {
  initialForm: false,
  drawingKeepout: null,
  keepoutList: []
};

const setInitialFormTrue = (state, action) => {
  return {
    ...state,
    initialForm: true
  };
};

const setInitialFormFalse = (state, action) => {
  return {
    ...state,
    initialForm: false
  };
};

const createKeepout = (state, action) => {
  return {
    initialForm: false,
    drawingKeepout: action.drawingKeepout,
    keepoutList: [...state.keepoutList, action.drawingKeepout]
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_INITIALFORM_TRUE:
      return setInitialFormTrue (state, action);
    case actionTypes.SET_INITIALFORM_FALSE:
      return setInitialFormFalse (state, action);
    case actionTypes.CREATE_KEEPOUT:
      return createKeepout (state, action);
    default: return state;
  }
};

export default reducer;
