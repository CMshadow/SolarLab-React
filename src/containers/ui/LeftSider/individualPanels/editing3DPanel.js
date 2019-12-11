import React from 'react';
import { connect } from 'react-redux';
import { Divider, Button } from 'antd';

import RoofList3D from './edit3D/roofList3D';
import KeepoutList3D from './edit3D/keepoutList3D';
import FinishedModelingButton from './drawButtons/finishModelingButton';
import * as actions from "../../../../store/actions/index";

import Point from '../../../../infrastructure/point/point';
import Shadow from "../../../../infrastructure/Polygon/shadow";
import Polygon from "../../../../infrastructure/Polygon/Polygon";
import Polyline from '../../../../infrastructure/line/polyline';

import * as Cesium from 'cesium';

import { projectEverything } from "../../../../infrastructure/math/shadowHelper";

const Editing3DPanel = (props) => {

  const shadowFunc = () => {
    const allKptList = props.keepoutList;
    const allTreeList = props.treeKeepoutList;
    const wall = props.buildingParapet;
    const foundationPolygon = props.foundationPolygon;

    props.projectAllShadow(allKptList, allTreeList, wall, foundationPolygon);
  }

  return (
    <div>
      <RoofList3D />
      <Divider />
      <KeepoutList3D />
      <Divider />
      <FinishedModelingButton />
      <Button onClick={() => shadowFunc()}> TEST BUTTON </Button>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    workingBuilding: state.buildingManagerReducer.workingBuilding,
    allNormalKeepout: state.keepoutManagerReducer.normalKeepout,
    allPassageKeepout: state.keepoutManagerReducer.passageKeepout,
    keepoutList: state.undoableReducer.present.drawingKeepoutPolygonManagerReducer.normalKeepout,
    treeKeepoutList: state.undoableReducer.present.drawingKeepoutPolygonManagerReducer.treeKeepout,
    foundationPolygon: state.undoableReducer.present.drawingPolygonManagerReducer.BuildingFoundation,
    buildingParapet: state.undoableReducer.present.drawingPolygonManagerReducer.BuildingParapet
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setDebugShadowPolygons: (plygons) => dispatch(
      actions.setDebugShadowPolygons(plygons)
    ),
    projectAllShadow: (allKptList, allTreeList, wall, foundationPolygon) => dispatch(
        actions.projectAllShadow(allKptList, allTreeList, wall, foundationPolygon)
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editing3DPanel);
