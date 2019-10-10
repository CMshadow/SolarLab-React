import React from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Button,
} from 'antd';

import * as actions from '../../../../../store/actions/index';
import * as uiStateJudge from '../../../../../infrastructure/ui/uiStateJudge';


const FinishModelingButton = (props) => {
  const DrawBuildingPolygon = (
    <Button
      type = 'primary'
      size = 'large'
      shape = 'round'
      block
      onClick = {() => {
        props.bindFoundPolyline();
        props.bindFoundPolygons();
      }}
    >Finish Modeling</Button>

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
    workingBuilding: state.buildingManagerReducer.workingBuilding,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    bindFoundPolyline: () => dispatch(actions.bindFoundPolyline()),
    bindFoundPolygons: () => dispatch(actions.bindFoundPolygons()),
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(FinishModelingButton);
