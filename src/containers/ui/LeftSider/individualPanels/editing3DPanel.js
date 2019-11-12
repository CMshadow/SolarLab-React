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

import { projectPlaneOnAnother } from "../../../../infrastructure/math/shadowHelper";

const Editing3DPanel = (props) => {

    const shadowFunc = () => {
        const allKptList = props.keepoutList;
        const foundationPolyline = props.foundationPolyline;

        var foundationPoints = foundationPolyline[0].convertHierarchyToPoints();

        for (var i = 0; i < allKptList.length; ++i) {
            var keepoutPoints = allKptList[0].outlinePolygon.convertHierarchyToPoints();
            var shadow = projectPlaneOnAnother(keepoutPoints, foundationPoints);
            for (var i = 0; i < shadow.length; ++i) {
                shadow[i].height += 0.01;
            }
            var shadow_line = new Polyline(shadow);
            shadow_line.color = Cesium.Color.BLACK;
            console.log("shadow_line");
            console.log(shadow_line);
            const shadowHier = Polygon.makeHierarchyFromPolyline(
              shadow_line, foundationPolyline[0].height, 0.005
            );
            const shadowPolygon = new Polygon(
              null, null, foundationPolyline[0].height, shadowHier, null, null,
              Cesium.Color.DARKGREY.withAlpha(0.75)
            );
            console.log(shadowPolygon)
            props.setDebugPolygons([shadowPolygon]);
        }
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
    foundationPolyline: state.undoableReducer.present.drawingPolygonManagerReducer.BuildingFoundation
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
