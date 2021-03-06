import React from 'react';
import { connect } from 'react-redux';
import PolygonVisualize from '../Polygon/Polygon';
import CustomSphere from '../sphere/sphere';
import CustomCylinder from '../cylinder/cylinder';

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

	let treeKeepoutPolygon = null;
	let treeKeepoutTrunk = null;
	if (props.treeKeepout !== []) {
		treeKeepoutPolygon = props.treeKeepout.map(kpt => (
      <CustomSphere
        key = {kpt.outlinePolygon.entityId}
				{...kpt.outlinePolygon}
			/>
    ));
		treeKeepoutTrunk = props.treeKeepout.map(kpt => (
      <CustomCylinder
        key = {kpt.outlinePolygonPart2.entityId}
				{...kpt.outlinePolygonPart2}
			/>
    ));
	}

	let envKeepoutPolygon = null;
	if (props.envKeepout !== []) {
		envKeepoutPolygon = props.envKeepout.map(kpt => (
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
			{treeKeepoutPolygon}
			{treeKeepoutTrunk}
			{envKeepoutPolygon}
		</div>
	);
};

const mapStateToProps = state => {
	return{
		normalKeepout:
			state.undoable.present.drawingKeepoutPolygonManager.normalKeepout,
		passageKeepout:
			state.undoable.present.drawingKeepoutPolygonManager.passageKeepout,
		ventKeepout:
			state.undoable.present.drawingKeepoutPolygonManager.ventKeepout,
		treeKeepout:
			state.undoable.present.drawingKeepoutPolygonManager.treeKeepout,
		envKeepout:
			state.undoable.present.drawingKeepoutPolygonManager.envKeepout,
	};
};


export default connect(mapStateToProps)(DrawingKeepoutPolygonManagerRender);
