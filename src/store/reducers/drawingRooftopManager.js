import * as Cesium from 'cesium';
import * as actionTypes from '../actions/actionTypes';
import RoofTop from '../../infrastructure/rooftop/rooftop';

const initState = {
	NodesCollection: null,
  EdgesMap: null,
	InnerEdgesCollection: null,
  OuterEdgesCollection: null,
  RoofPlaneCoordinatesCollection:null,
  RooftopCollection: new RoofTop(),
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

const showOnlyOneRoofPlane = (state, action) => {
	const newRoofTopCollection = RoofTop.CopyPolygon(state.RooftopCollection);
	let showIndex = 0;
	newRoofTopCollection.rooftopCollection.forEach((roof, ind) => {
		if (roof.entityId !== action.roofId) {
			roof.show = false;
		} else {
			showIndex = ind;
		}
	});
	newRoofTopCollection.rooftopExcludeStb.forEach((roofInd, ind) => {
		roofInd.forEach(roof => {
			if (showIndex !== ind) {
				roof.show = false;
			}
		});
	});
	return {
		...state,
		RooftopCollection: newRoofTopCollection
	};
}

const showAllRoofPlane = (state, action) => {
	const newRoofTopCollection = RoofTop.CopyPolygon(state.RooftopCollection);
	newRoofTopCollection.rooftopCollection.forEach(roof => {
		roof.show = true;
	});
	newRoofTopCollection.rooftopExcludeStb.forEach(roofInd => {
		roofInd.forEach(roof => {
			roof.show = true;
		});
	});
	return {
		...state,
		RooftopCollection: newRoofTopCollection
	};
}

const reducer = (state=initState, action) => {
  switch(action.type){
		case actionTypes.BUILD_3D_ROOFTOP_MODELING:
			return build3DRoofTopModeling(state, action);
		case actionTypes.SEARCH_ALL_ROOF_PLANES:
			return searchAllRoofPlanes(state, action);
		case actionTypes.SHOW_ONLY_ONE_ROOF:
			return showOnlyOneRoofPlane(state, action);
		case actionTypes.SHOW_ALL_ROOF:
			return showAllRoofPlane(state, action);
		default:
			return state;
	}

};

export default reducer;
