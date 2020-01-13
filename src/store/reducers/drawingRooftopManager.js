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
	threePointsIndex: null,
	editingInnerPlanePoints: null,
	hoverPoint: null,
	pickedPointIndex: null,
	threePointsInfo: {}
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
	const showIndex =
		state.RooftopCollection.rooftopCollection.reduce((acc, roof, ind) =>
			roof.entityId === action.roofId ? ind : acc
		, 0);
	const innerPlanePoints = state.RooftopCollection.rooftopCollection[showIndex]
		.convertHierarchyToPoints();
	if (state.threePointsInfo[showIndex]) {
		Object.keys(state.threePointsInfo[showIndex]).forEach(k => {
			let color = Cesium.Color.SLATEBLUE ;
			switch (k) {
				default:
					break;
				case '1':
					color = Cesium.Color.PLUM;
					break;
				case '2':
					color = Cesium.Color.OLIVEDRAB;
			}
			innerPlanePoints[state.threePointsInfo[showIndex][k].pointIndex].setColor(
				color
			)
		});
	}
	return {
		...state,
		editingInnerPlaneIndex: showIndex,
		threePointsIndex: action.threePointIndex,
		editingInnerPlanePoints: innerPlanePoints
	};
}

const showAllRoofPlane = (state, action) => {
	return {
		...state,
		editingInnerPlaneIndex: null,
		threePointsIndex: null,
		editingInnerPlanePoints: null,
		hoverPoint: null,
		pickedPointIndex: null,
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
	let color = Cesium.Color.SLATEBLUE;
	switch (state.threePointsIndex) {
		default:
			break;
		case 1:
			color = Cesium.Color.PLUM;
			break;
		case 2:
			color = Cesium.Color.OLIVEDRAB;
	};
	const newEditingInnerPlanePoints = state.editingInnerPlanePoints.map((p, i) =>
		i === action.pointIndex ?
		Point.fromPoint(p, null, null, null, null, null, null, color) :
		p
	);
	return {
		...state,
		editingInnerPlanePoints: newEditingInnerPlanePoints,
		pickedPointIndex: action.pointIndex,
		hoverPoint: null,
		threePointsInfo : {
			...state.threePointsInfo,
			[state.editingInnerPlaneIndex]: {
				...state.threePointsInfo[state.editingInnerPlaneIndex],
				[state.threePointsIndex]: {
					pointIndex: action.pointIndex,
				}
			}
		}
	}
}

const releasePickedRoofTopPointIndex = (state, action) => {
	return {
		...state,
		pickedPointIndex: null,
		hoverPoint: null
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
