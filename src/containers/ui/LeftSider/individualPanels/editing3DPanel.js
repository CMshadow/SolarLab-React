import React from 'react';
import { connect } from 'react-redux';
import { Divider, Button } from 'antd';

import RoofList3D from './edit3D/roofList3D';
import KeepoutList3D from './edit3D/keepoutList3D';
import FinishedModelingButton from './drawButtons/finishModelingButton';
import * as actions from "../../../../store/actions/index";

import Point from '../../../../infrastructure/point/point';
import Polygon from "../../../../infrastructure/Polygon/Polygon";
import Polyline from '../../../../infrastructure/line/polyline';

import * as Cesium from 'cesium';

import { projectEverything } from "../../../../infrastructure/math/shadowHelper";

const Editing3DPanel = (props) => {

    const shadowFunc = () => {
        const allKptList = props.keepoutList;
        const allTreeList = props.treeKeepoutList;
        const wall = props.buildingParapet;
        const foundationPolyline = props.foundationPolyline;

        var list_of_shadows = projectEverything(allKptList, allTreeList, wall, foundationPolyline);
        console.log(list_of_shadows)
        var list_of_shadow_polygons = [];

        for (var i = 0; i < list_of_shadows.length; ++i) {
            var shadow_line = new Polyline(list_of_shadows[i]);
            const shadowHier = Polygon.makeHierarchyFromPolyline(shadow_line, null, 0.015);
            const shadowPolygon = new Polygon(
                null, null, foundationPolyline[0].height, shadowHier, null, null,
                Cesium.Color.DARKGREY.withAlpha(0.75)
            );
            list_of_shadow_polygons.push(shadowPolygon);
        }

        props.setDebugPolygons(list_of_shadow_polygons);
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
    foundationPolyline: state.undoableReducer.present.drawingPolygonManagerReducer.BuildingFoundation,
    buildingParapet: state.undoableReducer.present.drawingPolygonManagerReducer.BuildingParapet
  };
};

const mapDispatchToProps = dispatch => {
    return {
        setDebugPoints: (points) => dispatch(actions.setDebugPoints(points)),
        setDebugPolylines: (plys) => dispatch(actions.setDebugPolylines(plys)),
        setDebugPolygons: (plygons) => dispatch(actions.setDebugPolygons(plygons))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editing3DPanel);
