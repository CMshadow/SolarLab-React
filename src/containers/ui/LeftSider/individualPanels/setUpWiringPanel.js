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
import InverterTable from './wiring/inverterTable';
const { Option } = Select;
const { TabPane } = Tabs;

class SetUpWiringPanel extends Component {
  state = {
    tab: 'manual',
    selectRoofIndex: 0,
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
                this.props.calculateManualInverter(
                  this.state.selectRoofIndex, e
                );
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
              if (e === 'auto')
                this.props.calculateAutoInverter(this.state.selectRoofIndex)
            }}
          >
            <TabPane tab="Manual" key="manual">
              <Spin
                spinning={this.props.backendLoading}
                indicator={<Icon type="loading" spin />}
              >
                {InverterSelect}
              </Spin>
            </TabPane>
            <TabPane
              tab='Auto'
              key="auto"
            >
              <Row>
                <Col span={24} style={{textAlign: 'center'}} >
                  <Spin
                    spinning={this.props.backendLoading}
                    indicator={<Icon type="loading" spin />}
                  />
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Form>
        <InverterTable roofIndex={this.state.selectRoofIndex} />
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
    panels: state.undoableReducer.present.editingPVPanelManagerReducer.panels,
    roofSpecParams: state.undoableReducer.present.editingPVPanelManagerReducer
      .roofSpecParams,
    projectInfo: state.projectManagerReducer.projectInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    calculateAutoInverter: (roofIndex) => dispatch(
      actions.calculateAutoInverter(roofIndex)
    ),
    calculateManualInverter: (roofIndex, inverterID) => dispatch(
      actions.calculateManualInverter(roofIndex, inverterID)
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'setupWiringPanel' })(SetUpWiringPanel));
