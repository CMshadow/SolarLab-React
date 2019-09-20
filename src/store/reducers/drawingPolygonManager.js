import * as Cesium from 'cesium';
import uuid from 'uuid/v1';
import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Polygon from '../../infrastructure/Polygon/Polygon';


const initialState = {
	BuildingFoundation: null
};

/**
 *
 *  CREATE 3D Building Foundation Polygon
 */
const createBuildingFoundationPolygon = (state, action) => {
	console.log('create building');
	let newFoundation = new Polygon()
	newFoundation.setHeight(action.height);
	newFoundation.setHierarchy([...action.coordinatesArray]);
	for (let i = 0; i < newFoundation.hierarchy.length; ++i) {
		if ((i + 1) % 3 === 0) {
			newFoundation.hierarchy[i] = newFoundation.height;
		}
	}

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
