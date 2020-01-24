import React from 'react';
import { connect } from 'react-redux';
import PolygonVisualize from '../Polygon/Polygon';
import CustomWall from '../wall/wall';

const drawing3DFoundManagerRender = (props) => {
	let drawingBuildingFoundation = null;
	if (props.DrawingBuidingFoundation !== []) {
		drawingBuildingFoundation =
			props.DrawingBuidingFoundation.map(individual => (
			<PolygonVisualize
				key={individual.entityId}
				{...individual}
			/>
		));
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
			state.undoable.present.drawingPolygonManager.BuildingFoundation,
		DrawingBuildingFoundationExcludeStb:
			state.undoable.present.drawingPolygonManager.BuildingFoundationExcludeStb,
		DrawingBuildingParapet:
			state.undoable.present.drawingPolygonManager.BuildingParapet,
		CurrentBuilding:
			state.undoable.present.buildingManager.workingBuilding
	};
};


export default connect(mapStateToProps)(drawing3DFoundManagerRender);
