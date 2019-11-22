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
	const newRooftop = Polygon.copyPolygon(
		state.RooftopCollection.rooftopCollection[action.updateIndex]
	);
	newRooftop.setHierarchy(action.newPolygonHierarchy);
	newRooftop.obliquity = action.newObliquity;
	newRooftop.lowestNode[2] = action.newLowestHeight;
	newRooftop.highestNode[2] = action.newHighestHeight;
	const newRooftopExcludeStb = state.RooftopCollection
	.rooftopExcludeStb[action.updateIndex].map(stbPolyogn => {
 		const newStbFoundLine = stbPolyogn.toFoundLine();
		newStbFoundLine.points.forEach(p => {
			p.setCoordinate(
				null, null,
				Coordinate.heightOfArbitraryNode(newRooftop, p) +
				newRooftop.lowestNode[2]
			)
		})
		console.log(newStbFoundLine)
		const newStbHierarchy = Polygon.makeHierarchyFromPolyline(
			newStbFoundLine, null, 0.005
		);
		console.log(newStbHierarchy)
		return new Polygon(null, null, null, newStbHierarchy);
	})
	console.log(newRooftopExcludeStb)
  const newRooftopCollection = RoofTop.CopyPolygon(state.RooftopCollection);
	newRooftopCollection.rooftopCollection[action.updateIndex] = newRooftop;
	newRooftopCollection.rooftopExcludeStb[action.updateIndex] = newRooftopExcludeStb;
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
