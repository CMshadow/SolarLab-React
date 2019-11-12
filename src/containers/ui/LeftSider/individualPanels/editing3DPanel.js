import React from 'react';
import { connect } from 'react-redux';
import { Divider, Button } from 'antd';

import RoofList3D from './edit3D/roofList3D';
import KeepoutList3D from './edit3D/keepoutList3D';
import FinishedModelingButton from './drawButtons/finishModelingButton';
import * as actions from "../../../../store/actions/index";

import Point from '../../../../infrastructure/point/point';

import { projectPlaneOnAnother } from "../../../../infrastructure/math/shadowHelper";

const Editing3DPanel = (props) => {

    const shadowFunc = () => {
        const allKptList = props.keepoutList;
        const foundationPolyline = props.foundationPolyline;

        const coordinates = allKptList[0].outlinePolygon.hierarchy;
        var keepoutPoints = [];
        for (var i = 0; i < coordinates.length; i = i + 3) {
            keepoutPoints.push(new Point(coordinates[i], coordinates[i + 1], coordinates[i + 2]));
        }

        for (var i = 0; i < allKptList.length; ++i) {
            var shadow = projectPlaneOnAnother(keepoutPoints, foundationPolyline.points);
            props.setDebugPolylines(shadow);
        }

         // props.setDebugPoints([0, 0, 0]);
         // props.setDebugPolylines([0, 0, 0])
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
        setDebugPolylines: (plys) => dispatch(actions.setDebugPolylines(plys))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editing3DPanel);
