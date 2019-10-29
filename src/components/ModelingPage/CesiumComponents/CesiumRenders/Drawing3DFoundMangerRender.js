import React from 'react';
import { connect } from 'react-redux';
import PolygonVisualize from '../Polygon/Polygon';
import CustomWall from '../wall/wall';
import * as actions from '../../../../store/actions/index';

const drawing3DFoundManagerRender = (props) => {
	let drawingBuildingFoundation = null;
	if (props.DrawingBuidingFoundation !== null) {
		drawingBuildingFoundation = (
			<PolygonVisualize
				{...props.DrawingBuidingFoundation}
			/>
		);
		props.CurrentBuilding.bindFoundPolygon(props.DrawingBuidingFoundation);
	}

	let drawingBuildingFoundationExcludeStb = null;
	if (props.DrawingBuildingFoundationExcludeStb !== []) {
		drawingBuildingFoundationExcludeStb =
			props.DrawingBuildingFoundationExcludeStb.map(individual => (
				<PolygonVisualize
					key={individual.entityId}
					{...individual}
				/>
			));
	}

	let drawingBuildingParapet = null;
	if (props.DrawingBuildingParapet !== null) {
		drawingBuildingParapet = (
			<CustomWall
				{...props.DrawingBuildingParapet}
			/>
		)
	}

	return (
		<div>
			{drawingBuildingFoundation}
			{drawingBuildingFoundationExcludeStb}
			{drawingBuildingParapet}
		</div>
	);
};

const mapStateToProps = state => {
	return{
		DrawingBuidingFoundation:
			state.undoableReducer.present.drawingPolygonManagerReducer
			.BuildingFoundation,
		DrawingBuildingFoundationExcludeStb:
			state.undoableReducer.present.drawingPolygonManagerReducer
			.BuildingFoundationExcludeStb,
		DrawingBuildingParapet:
			state.undoableReducer.present.drawingPolygonManagerReducer
			.BuildingParapet,
		CurrentBuilding: state.buildingManagerReducer.workingBuilding
	};
};


export default connect(mapStateToProps)(drawing3DFoundManagerRender);
