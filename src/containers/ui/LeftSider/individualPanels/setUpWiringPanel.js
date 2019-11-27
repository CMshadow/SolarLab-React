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
const { Option } = Select;
const { TabPane } = Tabs;

class SetUpWiringPanel extends Component {
  state = {
    tab: 'manual',
    selectInverterID: null,
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const InverterSelect = (
      <Form.Item>
        <Row>
          <Col span={20} offset={2}>
          {getFieldDecorator('inverterID', {
            rules: [{
              required: true,
              message: 'Please select one'
            }]
          })(
            <Select
              showSearch
              optionFilterProp='children'
              placeholder='Select a inverter'
              onChange={(e) => {
                this.setState({selectInverterID: e});
              }}
            >
              {this.props.userInverters.map(i =>
                <Option
                  key={i.inverterID}
                  value={i.inverterID}
                >
                  {i.inverterName}
                </Option>
              )}
            </Select>
          )}
          </Col>
        </Row>
      </Form.Item>
    )

    return (
      <div>
        <Row type="flex" justify="center">
          <h3>Setup Wiring</h3>
        </Row>
        <Form>
          <Tabs
            defaultActiveKey = {this.state.tab}
            size = 'small'
            tabBarGutter = {5}
            tabBarStyle = {{textAlign: 'center'}}
            onChange = {e => {
              this.setState({tab:e});
            }}
          >
            <TabPane tab="Manual" key="manual">
              {InverterSelect}
            </TabPane>
            <TabPane
              tab='Auto'
              key="auto"
            >
            </TabPane>
          </Tabs>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    backendLoading: state.projectManagerReducer.backendLoading,
    workingBuilding: state.buildingManagerReducer.workingBuilding,
    userInverters: state.undoableReducer.present.editingWiringManager.userInverters,
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
