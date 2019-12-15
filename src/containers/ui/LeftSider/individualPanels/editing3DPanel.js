import React from 'react';
import { connect } from 'react-redux';
import { Divider, Button } from 'antd';
import * as Cesium from 'cesium';

import RoofList3D from './edit3D/roofList3D';
import KeepoutList3D from './edit3D/keepoutList3D';
import FinishedModelingButton from './drawButtons/finishModelingButton';
import ShadowControl from './edit3D/shadowControl';

import * as actions from "../../../../store/actions/index";

import Point from '../../../../infrastructure/point/point';
import Shadow from "../../../../infrastructure/Polygon/shadow";
import Polygon from "../../../../infrastructure/Polygon/Polygon";
import Polyline from '../../../../infrastructure/line/polyline';

const Editing3DPanel = (props) => {

  return (
    <div>
      <RoofList3D />
      <Divider />
      <KeepoutList3D />
      <Divider />
      <ShadowControl />
      <Divider />
      <FinishedModelingButton />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    workingBuilding: state.buildingManagerReducer.workingBuilding,
    allNormalKeepout: state.keepoutManagerReducer.normalKeepout,
    allPassageKeepout: state.keepoutManagerReducer.passageKeepout,
  };
};

export default connect(mapStateToProps)(Editing3DPanel);
