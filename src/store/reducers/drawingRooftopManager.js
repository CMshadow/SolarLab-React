import * as Cesium from 'cesium';
import uuid from 'uuid/v1';
import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import Polygon from '../../infrastructure/Polygon/Polygon';


const initState = {
	NodesCollection: null,
  EdgesMap: null,
	InnerEdgesCollection: null,
  OuterEdgesCollection: null,
  RoofPlaneCoordinatesCollection:null,
  RooftopCollection: null,
  EnableToBuild: false,
}


const initEdgesMap = (state, action) => {


}

const initNodesCollection = (state, action) => {
  console.log('create rooftop polygon: ');
  let newRooftopCollection = [];
  for (let roofPlane of action.AllRoofPlanePaths) {
    let newRoofPlane = new Polygon();
    newRoofPlane.hierarchy = [...roofPlane];
    newRooftopCollection.push(newRoofPlane);
  }
 
  
  return{
    ...state,
		NodesCollection: [...action.nodesCollection],
		InnerEdgesCollection: [...action.InnerEdgeCollection],
    OuterEdgesCollection: [...action.OuterEdgesCollection],
    RoofPlaneCoordinatesCollection:[...action.AllRoofPlanePaths],
    EnableToBuild: true,
    RooftopCollection: newRooftopCollection
  }

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
