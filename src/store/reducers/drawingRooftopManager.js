import * as Cesium from 'cesium';
import * as actionTypes from '../actions/actionTypes';
import Polygon from '../../infrastructure/Polygon/Polygon';
import RoofTop from '../../infrastructure/rooftop/rooftop';
import Coordinate from '../../infrastructure/point/coordinate';

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
  console.log('create rooftop polygon: ');
  let newRooftopCollection = new RoofTop();
  for (let roofPlane of action.AllRoofPlanePaths) {
    let newRoofPlane = new Polygon(null,'roofPlane',null, 
      null, null,null,null,null,null,null,null,
      roofPlane.roofPlaneParameters[0],roofPlane.roofPlaneParameters[1],
      roofPlane.roofHighestLowestNodes[0], roofPlane.roofHighestLowestNodes[1], roofPlane.roofEdgesTypeList);

      newRoofPlane.hierarchy = [...roofPlane.roofPlaneCoordinateArray];
      console.log("test highest node  "+ newRoofPlane.highestNode)
      console.log("test edgeType  "+ newRoofPlane.edgesType)
      // console.log("test height of arbitrary node: " + Coordinate.heightOfArbitraryNode(newRoofPlane, new Coordinate(newRoofPlane.hierarchy[3], newRoofPlane.hierarchy[4], newRoofPlane.hierarchy[5])));
    newRooftopCollection.addRoofPlane(newRoofPlane);
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
		case actionTypes.BUILD_3D_ROOFTOP_MODELING:
			return build3DRoofTopModeling(state, action);
		case actionTypes.SEARCH_ALL_ROOF_PLANES:
			return searchAllRoofPlanes(state, action);
		default:
			return state;
	}

};

export default reducer;
