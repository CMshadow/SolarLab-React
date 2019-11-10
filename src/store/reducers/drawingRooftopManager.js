import * as Cesium from 'cesium';
import * as actionTypes from '../actions/actionTypes';

const initState = {
	NodesCollection: null,
  EdgesMap: null,
	InnerEdgesCollection: null,
  OuterEdgesCollection: null,
  RoofPlaneCoordinatesCollection:null,
  RooftopCollection: null,
  EnableToBuild: false,

}



const build3DRoofTopModeling = (state, action) => {

  return{
    ...state,
		NodesCollection: [...action.nodesCollection],
		InnerEdgesCollection: [...action.InnerEdgeCollection],
    OuterEdgesCollection: [...action.OuterEdgesCollection],
    RoofPlaneCoordinatesCollection:[...action.AllRoofPlanePaths],
    EnableToBuild: true,
    RooftopCollection: action.RooftopCollection
  }

}

const searchAllRoofPlanes = (state, action) => {

}

const reducer = (state=initState, action) => {
  switch(action.type){
		case actionTypes.BUILD_3D_ROOFTOP_MODELING:
			return build3DRoofTopModeling(state, action);
		case actionTypes.SEARCH_ALL_ROOF_PLANES:
			return searchAllRoofPlanes(state, action);
		default:
			return state;
	}

};

export default reducer;
