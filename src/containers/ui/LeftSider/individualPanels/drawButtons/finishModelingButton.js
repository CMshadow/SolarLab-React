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
      loading = {props.backendLoading}
      block
      onClick = {() => {
        props.bindShadow();
        if (props.workingBuilding.type === 'FLAT') {
          props.bindFoundPolyline();
          props.bindFoundPolygons();
        } else {
          props.bindPitchedPolygons();
        }
        props.bindAllKeepout();
        props.fetchUserPanels();
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
    backendLoading:  state.projectManagerReducer.backendLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    bindFoundPolyline: () => dispatch(actions.bindFoundPolyline()),
    bindFoundPolygons: () => dispatch(actions.bindFoundPolygons()),
    bindPitchedPolygons: () => dispatch(actions.bindPitchedPolygons()),
    bindAllKeepout: () => dispatch(actions.bindAllKeepout()),
    bindShadow: () => dispatch(actions.bindShadow()),
    fetchUserPanels: () => dispatch(actions.fetchUserPanels())
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(FinishModelingButton);
