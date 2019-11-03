import React from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Button,
} from 'antd';

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
          console.log('[Button]: Test RoofTop Polygon: ');
          props.CreatePitchedBuildingRoofTopPolygon();
        }
        props.createAllKeepoutPolygon();
      }}
    >Generate 3D Model</Button>

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
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    currentBuilding: state.buildingManagerReducer.workingBuilding,
    backendLoading:
      state.undoableReducer.present.drawingPolygonManagerReducer.backendLoading,
    keepoutList:
      state.undoableReducer.present.drawingKeepoutManagerReducer.keepoutList,

  };
};

const mapDispatchToProps = dispatch => {
  return {
    CreatePitchedBuildingRoofTopPolygon: () =>
      dispatch(actions.build3DRoofTopModeling()),
    createPolygonFoundationWrapper: () => dispatch(actions.createPolygonFoundationWrapper()),
    createAllKeepoutPolygon: () =>
      dispatch(actions.createAllKeepoutPolygon()),
 };
};

export default connect(mapStateToProps,mapDispatchToProps)(draw3DBuildingButton);
