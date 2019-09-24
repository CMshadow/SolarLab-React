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
        props.createPolygonFoundation();
        props.createPolygonFoundationExcludeStb();
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createPolygonFoundation: () =>
      dispatch(actions.createPolygonFoundation()),
    createPolygonFoundationExcludeStb: () =>
      dispatch(actions.createPolygonFoundationExcludeStb()),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(draw3DBuildingButton);
