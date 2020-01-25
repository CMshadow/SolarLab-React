import React from 'react';
import { connect } from 'react-redux';
import { Divider } from 'antd';

import RoofList3D from './edit3D/roofList3D';
import KeepoutList3D from './edit3D/keepoutList3D';
import FinishedModelingButton from './drawButtons/finishModelingButton';
import ShadowControl from './edit3D/shadowControl';

const Editing3DPanel = (props) => {

  return (
    <div style={{padding: '10px 10px 20px', overflow: 'auto'}}>
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
    uiState:
      state.undoable.present.uiStateManager.uiState,
    workingBuilding:
      state.undoable.present.buildingManager.workingBuilding,
    allNormalKeepout:
      state.undoable.present.keepoutManager.normalKeepout,
    allPassageKeepout:
      state.undoable.present.keepoutManager.passageKeepout,
  };
};

export default connect(mapStateToProps)(Editing3DPanel);
