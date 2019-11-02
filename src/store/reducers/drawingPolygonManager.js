import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import Polygon from '../../infrastructure/Polygon/Polygon';
import Wall from '../../infrastructure/Polygon/wall';


const initialState = {
	BuildingFoundation: [],
	BuildingFoundationExcludeStb: [],
	BuildingParapet: null,

	backendLoading: false

};

/**
 *
 *  CREATE 3D Building Foundation Polygon
 */
const createBuildingFoundationPolygon = (state, action) => {
	let newFoundation =
		new Polygon(null, null, action.height, action.coordinatesArray, null, null,
			Cesium.Color.ORANGE
		);
	return{
		...state,
		BuildingFoundation: [newFoundation]
	};
};

const createBuildingFoundationExcludeStbPolygon = (state, action) => {
	const polygonsExcludeStb = action.coordinatesArrays.map(hierarchy =>
		new Polygon(null, null, action.height, hierarchy)
	);
	return {
		...state,
		BuildingFoundationExcludeStb: polygonsExcludeStb
	};
}

const createBuildingParapet = (state, action) => {
	const wall = new Wall(
		null, null, action.positions, action.minimumHeight, action.maximumHeight
	);
	return {
		...state,
		BuildingParapet: wall
	};
}

const setBackendLoadingTrue = (state, action) => {
	return {
		...state,
		backendLoading: true
	};
}

const setBackendLoadingFalse = (state, action) => {
	return {
		...state,
		backendLoading: false
	};
}

const reducer = (state=initialState, action) => {
	switch(action.type){
		case actionTypes.CREATE_POLYGON_FOUNDATION:
			return createBuildingFoundationPolygon(state, action);
		case actionTypes.CREATE_POLYGON_FOUNDATION_EXCLUDE_SETBACK:
			return createBuildingFoundationExcludeStbPolygon(state, action);
		case actionTypes.CREATE_WALL:
			return createBuildingParapet(state, action);
		case actionTypes.SET_BACKENDLOADING_TRUE:
			return setBackendLoadingTrue(state, action);
		case actionTypes.SET_BACKENDLOADING_FALSE:
			return setBackendLoadingFalse(state, action);
		default:
			return state;
	}
};

export default reducer;
