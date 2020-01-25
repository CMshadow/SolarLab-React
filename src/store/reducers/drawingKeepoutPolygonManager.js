import * as actionTypes from '../actions/actionTypes';

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

const createAllTreeKeepoutPolygon = (state, action) => {
	return {
		...state,
		treeKeepout: action.treeKeepout
	}
}

const createAllEnvKeepoutPolygon = (state, action) => {
	return {
		...state,
		envKeepout: action.envKeepout
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
		case actionTypes.CREATE_ALL_TREE_KEEPOUT_POLYGON:
			return createAllTreeKeepoutPolygon(state, action);
		case actionTypes.CREATE_ALL_ENV_KEEPOUT_POLYGON:
			return createAllEnvKeepoutPolygon(state, action);
		default:
			return state;
	}
};

export default reducer;
