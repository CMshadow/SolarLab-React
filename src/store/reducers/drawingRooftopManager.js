import * as Cesium from 'cesium';
import * as actionTypes from '../actions/actionTypes';
import Point from '../../infrastructure/point/point';
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

	editingInnerPlaneIndex: null,
	editingInnerPlanePoints: null,
	hoverPoint: null,
	pickedPointIndex: null
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
	const innerPlanePoints = newRoofTopCollection.rooftopCollection[showIndex]
		.convertHierarchyToPoints();
	return {
		...state,
		RooftopCollection: newRoofTopCollection,
		editingInnerPlaneIndex: showIndex,
		editingInnerPlanePoints: innerPlanePoints
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

const setHoverRoofTopPointIndex = (state, action) => {
	const newPoint = Point.fromPoint(action.point);
	newPoint.setColor(Cesium.Color.ORANGE);
	const newEditingInnerPlanePoints = state.editingInnerPlanePoints.map(p => {
		if (p.entityId !== newPoint.entityId) {
			return p;
		} else {
			return newPoint;
		}
	});
	return {
		...state,
		editingInnerPlanePoints: newEditingInnerPlanePoints,
		hoverPoint: newPoint
	};
}

const releaseHoverRoofTopPointIndex = (state, action) => {
	const newPoint = Point.fromPoint(state.hoverPoint);
	newPoint.setColor(Cesium.Color.WHITE);
	const newEditingInnerPlanePoints = state.editingInnerPlanePoints.map(p => {
		if (p.entityId !== newPoint.entityId) {
			return p;
		} else {
			return newPoint;
		}
	});
	return {
		...state,
		editingInnerPlanePoints: newEditingInnerPlanePoints,
		hoverPoint: null
	};
}

const setPickedRoofTopPointIndex = (state, action) => {
	return {
		...state,
		pickedPointIndex: action.pointIndex
	}
}

const releasePickedRoofTopPointIndex = (state, action) => {
	return {
		...state,
		pickedPointIndex: null
	};
}

const reducer = (state=initState, action) => {
  switch(action.type){
		case actionTypes.BUILD_3D_ROOFTOP_MODELING:
			return build3DRoofTopModeling(state, action);
		case actionTypes.UPDATE_SINGLE_ROOF_TOP:
			return updateSingleRoofTop(state, action);
		case actionTypes.SHOW_ONLY_ONE_ROOF:
			return showOnlyOneRoofPlane(state, action);
		case actionTypes.SHOW_ALL_ROOF:
			return showAllRoofPlane(state, action);
		case actionTypes.SET_HOVER_ROOFTOP_POINT:
			return setHoverRoofTopPointIndex(state, action);
		case actionTypes.RELEASE_HOVER_ROOFTOP_POINT:
			return releaseHoverRoofTopPointIndex(state, action);
		case actionTypes.SET_PICKED_ROOFTOP_POINT:
			return setPickedRoofTopPointIndex(state, action);
		case actionTypes.RELEASE_PICKED_ROOFTOP_POINT:
			return releasePickedRoofTopPointIndex(state, action);
		default:
			return state;
	}

};

export default reducer;
