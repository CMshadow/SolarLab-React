import * as Cesium from 'cesium';
import uuid from 'uuid/v1';
import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Polygon from '../../infrastructure/Polygon/Polygon';


const initState = {
  EdgesMap: null,
  RooftopCollection: null
}


const initEdgesMap = (state, action) => {

}

const initNodesCollection = (state, action) => {

}

const searchAllRoofPlanes = (state, action) => {

}

const reducer = (state=initState, action) => {
  switch(action.type){
		case actionTypes.INIT_EDGES_MAP:
			return initEdgesMap(state, action);
		case actionTypes.INIT_NODES_COLLECTION:
			return initNodesCollection(state, action);
		case actionTypes.SEARCH_ALL_ROOF_PLANES:
			return searchAllRoofPlanes(state, action);
		default:
			return state;
	}

};

export default reducer;
