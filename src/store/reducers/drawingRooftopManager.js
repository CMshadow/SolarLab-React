import * as Cesium from 'cesium';
import * as actionTypes from '../actions/actionTypes';
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
  console.log('update rooftop polygon: ');
  // let newRooftopCollection = this.state.RooftopCollection.CopyPolygon();
  let newRooftopCollection = new RoofTop();
  // console.log("bbbbbbbbbbbbbbbbbbb: "+state.RoofPlaneCoordinatesCollection.length)
  for (let roofPlaneIndex = 0;  roofPlaneIndex < state.RoofPlaneCoordinatesCollection.length; ++roofPlaneIndex) {

    if (roofPlaneIndex !== action.updateIndex){
      let roofPlane = state.RoofPlaneCoordinatesCollection[roofPlaneIndex];
      // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: "+roofPlane.roofPlaneParameters[0])
      let newRoofPlane = new Polygon(null,'roofPlane',null,
        null, null,null,null,null,null,null,null,
        roofPlane.roofPlaneParameters[0],roofPlane.roofPlaneParameters[1],
        roofPlane.roofHighestLowestNodes[0], roofPlane.roofHighestLowestNodes[1], roofPlane.roofEdgesTypeList);

        newRoofPlane.hierarchy = [...roofPlane.roofPlaneCoordinateArray];
        console.log("test highest node  "+ newRoofPlane.highestNode)
        console.log("test edgeType  "+ newRoofPlane.edgesCollection)
        // console.log("test height of arbitrary node: " + Coordinate.heightOfArbitraryNode(newRoofPlane, new Coordinate(newRoofPlane.hierarchy[3], newRoofPlane.hierarchy[4], newRoofPlane.hierarchy[5])));
      newRooftopCollection.addRoofPlane(newRoofPlane);
    } else {
      let roofPlane = state.RoofPlaneCoordinatesCollection[roofPlaneIndex];
      let newRoofPlane = new Polygon(null,'roofPlane',null,
        null, null,null,null,null,null,null,null,
        roofPlane.roofPlaneParameters[0],roofPlane.roofPlaneParameters[1],
        roofPlane.roofHighestLowestNodes[0], roofPlane.roofHighestLowestNodes[1], roofPlane.roofEdgesTypeList);

        newRoofPlane.hierarchy = [...action.newPolygonHierarchy];
        console.log("test highest node  "+ newRoofPlane.highestNode)
        console.log("test edgeType  "+ newRoofPlane.edgesCollection)
        // console.log("test height of arbitrary node: " + Coordinate.heightOfArbitraryNode(newRoofPlane, new Coordinate(newRoofPlane.hierarchy[3], newRoofPlane.hierarchy[4], newRoofPlane.hierarchy[5])));
      newRooftopCollection.addRoofPlane(newRoofPlane);
    }

  }
  return{
    ...state,
    RooftopCollection: newRooftopCollection
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
