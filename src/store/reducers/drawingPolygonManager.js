import * as Cesium from 'cesium';
import uuid from 'uuid/v1';
import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Polygon from '../../infrastructure/Polygon/Polygon';


const initialState = {
	BuildingFoundation: null,
	
};

/**
 *
 *  CREATE 3D Building Foundation Polygon
 */
const createBuildingFoundationPolygon = (state, action) => {
	let newFoundation = new Polygon(null, "BuildingFoundation", action.height, action.coordinatesArray)
	return{
		...state,
		BuildingFoundation: newFoundation
	};
};

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
		case actionTypes.SET_POLYGON_FOUNDATION:
			return setUpBuildingFoundationPolygon(state, action);
		default:
			return state;
	}
 };

 export default reducer;
