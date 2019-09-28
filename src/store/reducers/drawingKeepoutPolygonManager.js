import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import Polygon from '../../infrastructure/Polygon/Polygon';
import Wall from '../../infrastructure/Polygon/wall';


const initialState = {
	normalKeepout: [],
  passageKeepout: [],
  ventKeepout: [],
  treeKeepout: [],
  envKeepout: [],

	backendLoading: false
};

const createAllNormalKeepoutPolygon = (state, action) => {
  return {
    ...state,
    normalKeepout: action.normalKeepout,
  }
}

const createAllPassageKeepoutPolygon = (state, action) => {
  return {
    ...state,
    passageKeepout: action.passageKeepout,
  }
}

const createAllVentKeepoutPolygon = (state, action) => {
	return {
		...state,
		ventKeepout: action.ventKeepout
	}
}

const reducer = (state=initialState, action) => {
	switch(action.type){
		case actionTypes.CREATE_ALL_NORMAL_KEEPOUT_POLYGON:
			return createAllNormalKeepoutPolygon(state, action);
    case actionTypes.CREATE_ALL_PASSAGE_KEEPOUT_POLYGON:
      return createAllPassageKeepoutPolygon(state, action);
		case actionTypes.CREATE_ALL_VENT_KEEPOUT_POLYGON:
			return createAllVentKeepoutPolygon(state, action);
		default:
			return state;
	}
};

export default reducer;
