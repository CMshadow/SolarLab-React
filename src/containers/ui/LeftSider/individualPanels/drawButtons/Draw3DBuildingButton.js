import React from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Button,
} from 'antd';
import { FormattedMessage } from 'react-intl';

import * as actions from '../../../../../store/actions/index';
import * as uiStateJudge from '../../../../../infrastructure/ui/uiStateJudge';


const draw3DBuildingButton = (props) => {
  const DrawBuildingPolygon = (
    <Button
      type = 'primary'
      size = 'large'
      shape = 'round'
      block
      loading = {props.backendLoading}
      disabled = {
        (props.currentBuilding.type === 'FLAT' ?
        !uiStateJudge.isFinishedFound(props.uiState) :
        !uiStateJudge.isFinishedInner(props.uiState)) || (
          props.keepoutList.filter(kpt => !kpt.finishedDrawing).length !== 0
        )
      }
      onClick = {() => {
        if (props.currentBuilding.type === 'FLAT') {
          props.createPolygonFoundationWrapper();
        } else {
          props.CreatePitchedBuildingRoofTopPolygon();
        }
      }}
    ><FormattedMessage id='generate3Dmodel_button' /></Button>

  );

  return (
    <Row>
      <Col span={18} offset={3}>
        {DrawBuildingPolygon}
      </Col>
    </Row>
  );
}

const mapStateToProps = state => {
  return {
    uiState:
      state.undoable.present.uiStateManager.uiState,
    currentBuilding:
      state.undoable.present.buildingManager.workingBuilding,
    backendLoading:
      state.undoable.present.projectManager.backendLoading,
    keepoutList:
      state.undoable.present.drawingKeepoutManager.keepoutList,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    CreatePitchedBuildingRoofTopPolygon: () =>
      dispatch(actions.build3DRoofTopModeling()),
    createPolygonFoundationWrapper: () =>
      dispatch(actions.createPolygonFoundationWrapper()),
    createAllKeepoutPolygon: () =>
      dispatch(actions.createAllKeepoutPolygon())
 };
};

export default connect(mapStateToProps,mapDispatchToProps)(draw3DBuildingButton);
