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
      disabled = {
        props.CurrentBuilding.type === 'FLAT' ?
        !uiStateJudge.isFinishedFound(props.uiState) :
        !uiStateJudge.isFinishedInner(props.uiState)
      }
      onClick = {() => {
        console.log('[Button]: Test Polygon: ');
        let buildingCoordinatesArray =
          props.BuildFoundation.getPointsCoordinatesArray();
        buildingCoordinatesArray.splice(buildingCoordinatesArray.length - 3, 3);
        props.CreateBuildingFoundationPolygon(
          props.CurrentBuilding.foundationHeight,
          buildingCoordinatesArray
        );
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
    CurrentBuilding: state.buildingManagerReducer.workingBuilding,
    BuildFoundation: state.undoableReducer.present.drawingManagerReducer.drawingPolyline
  };
};

const mapDispatchToProps = dispatch => {
  return {
    CreateBuildingFoundationPolygon: (newHeight, coordinatesArray) =>
      dispatch(actions.createPolygonFoundation(newHeight, coordinatesArray))
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(draw3DBuildingButton);
