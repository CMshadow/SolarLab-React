import React from 'react';
import { connect } from 'react-redux';
import PolygonVisualize from '../Polygon/Polygon';
import CustomWall from '../wall/wall';
import * as actions from '../../../../store/actions/index';

const DrawingKeepoutPolygonManagerRender = (props) => {
	let normalKeepoutPolygon = null;
	let normalKeepoutPolygonStb = null;
	if (props.normalKeepout !== []) {
		normalKeepoutPolygon = props.normalKeepout.map(kpt => (
      <PolygonVisualize
        key = {kpt.outlinePolygon.entityId}
				{...kpt.outlinePolygon}
			/>
    ));
		normalKeepoutPolygonStb = props.normalKeepout
			.filter(kpt => kpt.outlinePolygonPart2 !== null)
			.map(kpt => (
	      <PolygonVisualize
	        key = {kpt.outlinePolygonPart2.entityId}
					{...kpt.outlinePolygonPart2}
				/>
	    ));
	}

	let passageKeepoutPolygon = null;
	if (props.passageKeepout !== []) {
		passageKeepoutPolygon = props.passageKeepout.map(kpt => (
      <PolygonVisualize
        key = {kpt.outlinePolygon.entityId}
				{...kpt.outlinePolygon}
			/>
    ));
	}

	let ventKeepoutPolygon = null;
	if (props.ventKeepout !== []) {
		ventKeepoutPolygon = props.ventKeepout.map(kpt => (
      <PolygonVisualize
        key = {kpt.outlinePolygon.entityId}
				{...kpt.outlinePolygon}
			/>
    ));
	}

	return (
		<div>
			{normalKeepoutPolygon}
			{normalKeepoutPolygonStb}
			{passageKeepoutPolygon}
			{ventKeepoutPolygon}
		</div>
	);
};

const mapStateToProps = state => {
	return{
		normalKeepout:
			state.undoableReducer.present.drawingKeepoutPolygonManagerReducer
			.normalKeepout,
		passageKeepout:
			state.undoableReducer.present.drawingKeepoutPolygonManagerReducer
			.passageKeepout,
		ventKeepout:
			state.undoableReducer.present.drawingKeepoutPolygonManagerReducer
			.ventKeepout,
	};
};


export default connect(mapStateToProps)(DrawingKeepoutPolygonManagerRender);
