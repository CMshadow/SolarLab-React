import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/pro-light-svg-icons'
import {
  Divider,
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
          props.createAllKeepoutPolygon();
        } else {
          console.log('[Button]: Test Polygon: ');
          let buildingCoordinatesArray= props.BuildFoundation.getPointsCoordinatesArray();
          let buildingCoordinatesSize = buildingCoordinatesArray.length;
          buildingCoordinatesArray.splice(buildingCoordinatesSize - 3,3);
          props.CreatePitchedBuildingRoofTopPolygon(buildingCoordinatesArray, props.PolylinesRelation);
        }
      }}
    >Test: Draw Foundation</Button>

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
    BuildFoundation:
      state.undoableReducer.present.drawingManagerReducer.drawingPolyline,
    PitchedBuildingRoofTop:
      state.undoableReducer.present.drawingRooftopManagerReducer,
    PolylinesRelation:
      state.undoableReducer.present.drawingInnerManagerReducer.pointsRelation
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createPolygonFoundationWrapper: () =>
      dispatch(actions.createPolygonFoundationWrapper()),
    createAllKeepoutPolygon: () =>
      dispatch(actions.createAllKeepoutPolygon()),
    CreatePitchedBuildingRoofTopPolygon: (buindingBoundary, polylinesRelation) =>
      dispatch(actions.build3DRoofTopModeling(buindingBoundary, polylinesRelation))
 };
};

export default connect(mapStateToProps,mapDispatchToProps)(draw3DBuildingButton);
