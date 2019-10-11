import React from 'react';
import { connect } from 'react-redux';
import {
  Divider,
  Button
} from 'antd';
import * as martinez from 'martinez-polygon-clipping';

import RoofList3D from './edit3D/roofList3D';
import KeepoutList3D from './edit3D/keepoutList3D';
import FinishedModelingButton from './drawButtons/finishModelingButton';

const DrawBuildingPanel = (props) => {

  const generateDiffGeometry = (props) => {
    const geoFoundation =
      props.workingBuilding.foundationPolygonExcludeStb.map(polygon =>
        polygon.toFoundLine().makeGeoJSON()
      );
    const geoNormalKeepout =
      props.allNormalKeepout.map(kpt => kpt.keepout.outlinePolygonPart2.toFoundLine().makeGeoJSON())
    const geoPassageKeepout =
      props.allPassageKeepout.map(kpt => kpt.keepout.outlinePolygon.toFoundLine().makeGeoJSON())
    console.log(geoFoundation)
    console.log(geoNormalKeepout)
    console.log(geoPassageKeepout)
    let a = martinez.union(geoPassageKeepout[0].geometry.coordinates,geoNormalKeepout[0].geometry.coordinates)
    a= martinez.diff(geoFoundation[0].geometry.coordinates,a)
    console.log(a)
  }

  const testButton = (
    <Button
      type = 'danger'
      size = 'large'
      shape = 'round'
      block
      onClick = {() => {
        generateDiffGeometry(props)
      }}
    >TEST BUTTON</Button>
  )

  return (
    <div>
      <RoofList3D />
      <Divider />
      <KeepoutList3D />
      <Divider />
      <FinishedModelingButton />
      {testButton}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    workingBuilding: state.buildingManagerReducer.workingBuilding,
    allNormalKeepout: state.keepoutManagerReducer.normalKeepout,
    allPassageKeepout: state.keepoutManagerReducer.passageKeepout
  };
};

export default connect(mapStateToProps)(DrawBuildingPanel);
