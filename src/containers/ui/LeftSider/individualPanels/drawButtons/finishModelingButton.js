import React from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Button,
} from 'antd';

import * as actions from '../../../../../store/actions/index';

const FinishModelingButton = (props) => {
  const finishAdjustButton = (
    <Button
      type = 'primary'
      size = 'large'
      shape = 'round'
      block
      onClick = {() => {
        props.bindFoundPolyline();
        props.bindFoundPolygons();
        props.bindAllKeepout();
        props.setUIStateSetUpPV();
      }}
    >Finish Modeling</Button>

  );
  return (
    <Row>
    <Col span={18} offset={3}>
      {finishAdjustButton}
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
    bindAllKeepout: () => dispatch(actions.bindAllKeepout()),
    setUIStateSetUpPV: () => dispatch(actions.setUIStateSetUpPV())
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(FinishModelingButton);
