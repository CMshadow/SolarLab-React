import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Icon,
  Select,
  Row,
  Col,
  Button,
  Tabs,
  Spin
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';

import * as actions from '../../../../store/actions/index';
import InverterTable from './wiringAndBridging/inverterTable';
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
              placeholder={
                this.props.intl.formatMessage({id:'select_a_inverter'})
              }
              onChange={(e) => {
                this.setState({selectInverterID: e});
                this.props.calculateManualInverter(e);
              }}
            >
              {this.props.userInverters.map(i =>
                <Option
                  key={i.inverterID}
                  value={i.inverterID}
                  title={i.inverterName}
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
      <div style={{padding: '10px 10px 20px', overflow: 'auto'}}>
        <Row type="flex" justify="center">
          <h3><FormattedMessage id='setup_wiring' /></h3>
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
                this.props.calculateAutoInverter()
            }}
          >
            <TabPane
              tab={
                this.props.intl.formatMessage({id:'wiring_manual_selection'})
              }
              key="manual"
            >
              <Spin
                spinning={this.props.backendLoading}
                indicator={<Icon type="loading" spin />}
              >
                {InverterSelect}
              </Spin>
            </TabPane>
            <TabPane
              tab={this.props.intl.formatMessage({id:'wiring_auto_selection'})}
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
        <InverterTable />
        <Row type="flex" justify="center">
          <Button
            type='primary'
            shape='round'
            size='large'
            disabled = {
              this.props.entireSpecInverters.length === 0 ||
              this.props.backendLoading
            }
            onClick = {this.props.setUIStateSetUpBridging}
          >
            <FormattedMessage id='continue_button_wiring' />
            <Icon type='right' />
          </Button>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    uiState:
      state.undoable.present.uiStateManager.uiState,
    projectInfo:
      state.undoable.present.projectManager.projectInfo,
    backendLoading:
      state.undoable.present.projectManager.backendLoading,
    workingBuilding:
      state.undoable.present.buildingManager.workingBuilding,
    userInverters:
      state.undoable.present.editingWiringManager.userInverters,
    panels:
      state.undoable.present.editingPVPanelManager.panels,
    roofSpecParams:
      state.undoable.present.editingPVPanelManager.roofSpecParams,
    entireSpecInverters:
      state.undoable.present.editingWiringManager.entireSpecInverters,

    normalKeepout:
      state.undoable.present.drawingKeepoutPolygonManager.normalKeepout,
    treeKeepout:
      state.undoable.present.drawingKeepoutPolygonManager.treeKeepout,
    userPanels:
      state.undoable.present.editingPVPanelManager.userPanels,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    calculateAutoInverter: () => dispatch(
      actions.calculateAutoInverter()
    ),
    calculateManualInverter: (inverterID) => dispatch(
      actions.calculateManualInverter(inverterID)
    ),
    bindPVPanels: () => dispatch(actions.bindPVPanels()),
    bindInverters: () => dispatch(actions.bindInverters()),
    setUIStateSetUpBridging: () => dispatch(actions.setUIStateSetUpBridging())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Form.create({ name: 'setupWiringPanel' })(SetUpWiringPanel)));
