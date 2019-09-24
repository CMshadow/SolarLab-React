import React from 'react';
import { connect } from 'react-redux';
import PolygonVisualize from '../../Polygon/Polygon';
import * as actions from '../../../../../store/actions/index';



const drawing3DFoundManagerRender = (props) => {
	let drawingBuildingFoundation = null;
	if (props.DrawingBuidingFoundation !== null) {
		drawingBuildingFoundation = (<PolygonVisualize
		{...props.DrawingBuidingFoundation}/>);
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

	return (
		<div>
			{drawingBuildingFoundation}
			{drawingBuildingFoundationExcludeStb}
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
		CurrentBuilding: state.buildingManagerReducer.workingBuilding
	};
};


export default connect(mapStateToProps)(drawing3DFoundManagerRender);
