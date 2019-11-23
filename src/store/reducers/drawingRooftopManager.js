import * as Cesium from 'cesium';
import * as actionTypes from '../actions/actionTypes';
import Coordinate from '../../infrastructure/point/coordinate';
import RoofTop from '../../infrastructure/rooftop/rooftop';
import Polygon from '../../infrastructure/Polygon/Polygon';

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

const updateSingleRoofTop = (state, action) => {
  return{
    ...state,
    RooftopCollection: action.newRooftopCollection
  }
}

const reducer = (state=initState, action) => {
  switch(action.type){
		case actionTypes.BUILD_3D_ROOFTOP_MODELING:
			return build3DRoofTopModeling(state, action);
		case actionTypes.UPDATE_SINGLE_ROOF_TOP:
			return updateSingleRoofTop(state, action);
		default:
			return state;
	}

};

export default reducer;
