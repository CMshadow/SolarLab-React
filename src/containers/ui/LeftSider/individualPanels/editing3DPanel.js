import React from 'react';
import { connect } from 'react-redux';
import { Divider, Button } from 'antd';

import RoofList3D from './edit3D/roofList3D';
import KeepoutList3D from './edit3D/keepoutList3D';
import FinishedModelingButton from './drawButtons/finishModelingButton';
import * as actions from "../../../../store/actions/index";

import { projectPlaneOnAnother } from "../../../../infrastructure/math/shadowHelper"

const Editing3DPanel = (props) => {

    const shadowFunc = () => {
        const allKptList = props.keepoutList;
        const foundationPolyline = props.foundationPolyline;

        //console.log("allKptList:");
        //console.log(allKptList[0]);
        //console.log(allKptList[0].outlinePolyline);
        //console.log(allKptList[0].outlinePolyline.points);
        //console.log("foundationPolyline:");
        //console.log(foundationPolyline);
        //console.log(foundationPolyline.points);


        for (var i = 0; i < allKptList.length; ++i) {
            var shadow = projectPlaneOnAnother(allKptList[i].outlinePolyline.points, foundationPolyline.points);
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
    keepoutList: state.undoableReducer.present.drawingKeepoutManagerReducer.keepoutList,
    foundationPolyline: state.undoableReducer.present.drawingManagerReducer.drawingPolyline
  };
};

const mapDispatchToProps = dispatch => {
    return {
        setDebugPoints: (points) => dispatch(actions.setDebugPoints(points)),
        setDebugPolylines: (plys) => dispatch(actions.setDebugPolylines(plys))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editing3DPanel);
