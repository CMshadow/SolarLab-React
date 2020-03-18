import React from 'react';
import { connect } from 'react-redux';
import {
  Divider,
} from 'antd';
import { FormattedMessage } from 'react-intl';


import * as uiStateJudge from '../../../../infrastructure/ui/uiStateJudge';
import DrawFoundButton from './drawButtons/drawFoundButton';
import DrawInnerButton from './drawButtons/drawInnerButton';
import DrawKeepoutList from './drawKeepout/drawKeepoutList';
import DrawBuilding3DPolygon from './drawButtons/Draw3DBuildingButton';

const DrawBuildingPanel = (props) => {
  const drawFound = (
    <div>
      <Divider><FormattedMessage id='Step_1' /></Divider>
      <DrawFoundButton />
    </div>
  )

  const drawInner = (
    <div>
      <Divider><FormattedMessage id='Step_2_P' /></Divider>
      <DrawInnerButton />
    </div>
  )

  const drawKeepout = (
    <div>
      {
        props.workingBuilding.type === 'PITCHED' ?
        <Divider><FormattedMessage id='Step_3' /></Divider> :
        <Divider><FormattedMessage id='Step_2_F' /></Divider>
      }
      <DrawKeepoutList />
    </div>
  )

  const generate3D = (
    <div>
      <Divider><FormattedMessage id='generate3Dmodel' /></Divider>
      <DrawBuilding3DPolygon />
    </div>
  )

  const FlatBuildingLayout = (
    <div>
      {drawFound}
      {uiStateJudge.isFoundDrew(props.uiState) ? drawKeepout : null}
      {uiStateJudge.isFoundDrew(props.uiState) ? generate3D : null}
    </div>
  );

  const PitchedBuildingLayout = (
    <div>
      {drawFound}
      {uiStateJudge.isFoundDrew(props.uiState) ? drawInner : null}
      {uiStateJudge.isInnerDrew(props.uiState) ? drawKeepout : null}
      {uiStateJudge.isInnerDrew(props.uiState) ? generate3D : null}
    </div>
  );
  return (
    <div style={{padding: '10px 10px 20px', overflow: 'auto'}}>
      {
        props.workingBuilding.type === 'PITCHED' ?
        PitchedBuildingLayout :
        FlatBuildingLayout
      }
    </div>
  );
};

const mapStateToProps = state => {
  return {
    uiState:
      state.undoable.present.uiStateManager.uiState,
    workingBuilding:
      state.undoable.present.buildingManager.workingBuilding
  };
};

export default connect(mapStateToProps)(DrawBuildingPanel);
