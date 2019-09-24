import * as Cesium from 'cesium';
import uuid from 'uuid/v1';
import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Polygon from '../../infrastructure/Polygon/Polygon';


const initialState = {
	BuildingFoundation: null,
	BuildingFoundationExcludeStb: []
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
		BuildingFoundation: newFoundation
	};
};

const createBuildingFoundationExcludeStbPolygon = (state, action) => {
	const polygonsExcludeStb = action.coordinatesArrays.map(hierarchy =>
		new Polygon(null, null, action.height, hierarchy)
	);
	return{
		...state,
		BuildingFoundationExcludeStb: polygonsExcludeStb
	};
}

/**
 *
 *  Set Up The Props of 3D Building Foundation Polygon
 */

const setUpBuildingFoundationPolygon = (state, action) => {
	return null;
};


 const reducer = (state=initialState, action) => {
	switch(action.type){
		case actionTypes.CREATE_POLYGON_FOUNDATION:
			return createBuildingFoundationPolygon(state, action);
		case actionTypes.CREATE_POLYGON_FOUNDATION_EXCLUDE_SETBACK:
			return createBuildingFoundationExcludeStbPolygon(state, action);
		case actionTypes.SET_POLYGON_FOUNDATION:
			return setUpBuildingFoundationPolygon(state, action);
		default:
			return state;
	}
 };

 export default reducer;
