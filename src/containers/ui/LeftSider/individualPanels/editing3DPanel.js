import React from 'react';
import { connect } from 'react-redux';
import {
  Divider,
} from 'antd';
import RoofList3D from './edit3D/roofList3D';
import KeepoutList3D from './edit3D/keepoutList3D';

const DrawBuildingPanel = (props) => {
  return (
    <div>
      <RoofList3D />
      <Divider />
      <KeepoutList3D />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    workingBuilding: state.buildingManagerReducer.workingBuilding
  };
};

export default connect(mapStateToProps)(DrawBuildingPanel);
