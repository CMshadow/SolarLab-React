import React from 'react';
import { connect } from 'react-redux';
import PolygonVisualize from '../Polygon/Polygon';
import CustomWall from '../wall/wall';
import * as actions from '../../../../store/actions/index';

const DrawingKeepoutPolygonManagerRender = (props) => {
	let normalKeepoutPolygon = null;
	let normalKeepoutPolygonStb = null;
	if (props.normalKeepoutPolygon !== []) {
		normalKeepoutPolygon = props.normalKeepoutPolygon.map(kpt => (
      <PolygonVisualize
        key = {kpt.outlinePolygon.entityId}
				{...kpt.outlinePolygon}
			/>
    ));
		normalKeepoutPolygonStb = props.normalKeepoutPolygon
			.filter(kpt => kpt.outlinePolygonPart2 !== null)
			.map(kpt => (
	      <PolygonVisualize
	        key = {kpt.outlinePolygonPart2.entityId}
					{...kpt.outlinePolygonPart2}
				/>
	    ));
	}

	return (
		<div>
			{normalKeepoutPolygon}
			{normalKeepoutPolygonStb}
		</div>
	);
};

const mapStateToProps = state => {
	return{
		normalKeepoutPolygon:
			state.undoableReducer.present.drawingKeepoutPolygonManagerReducer
			.normalKeepout,
	};
};


export default connect(mapStateToProps)(DrawingKeepoutPolygonManagerRender);
