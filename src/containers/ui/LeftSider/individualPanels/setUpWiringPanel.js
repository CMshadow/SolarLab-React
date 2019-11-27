import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Input,
  InputNumber,
  Divider,
  Tooltip,
  Icon,
  Select,
  Row,
  Col,
  Button,
  Radio,
  Tabs,
  Spin
} from 'antd';

import * as actions from '../../../../store/actions/index';
import axios from '../../../../axios-setup';

class SetUpWiringPanel extends Component {
  render() {
    return (
      <div>
        <Row type="flex" justify="center">
          <h3>Setup Wiring</h3>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    parameters: state.undoableReducer.present.editingPVPanelManagerReducer
      .parameters,
    backendLoading: state.projectManagerReducer.backendLoading,
    workingBuilding: state.buildingManagerReducer.workingBuilding,
    userPanels: state.undoableReducer.present.editingPVPanelManagerReducer.userPanels,
    roofSpecParams: state.undoableReducer.present.editingPVPanelManagerReducer
      .roofSpecParams,
    projectInfo: state.projectManagerReducer.projectInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setupPanelParams: (values, roofIndex) =>
      dispatch(actions.setupPanelParams(values, roofIndex)),
    generatePanels: (roofIndex) => dispatch(actions.generatePanels(roofIndex)),
    setDebugPolylines: (polylines) =>
      dispatch(actions.setDebugPolylines(polylines)),
    setDebugPoints: (points) => dispatch(actions.setDebugPoints(points)),
    setBackendLoadingTrue: () => dispatch(actions.setBackendLoadingTrue()),
    setBackendLoadingFalse: () => dispatch(actions.setBackendLoadingFalse())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'setupWiringPanel' })(SetUpWiringPanel));
