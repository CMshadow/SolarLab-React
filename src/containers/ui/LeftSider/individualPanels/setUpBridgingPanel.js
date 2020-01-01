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
import { injectIntl, FormattedMessage } from 'react-intl';

import * as actions from '../../../../store/actions/index';
import axios from '../../../../axios-setup';
import BridgingTable from './wiringAndBridging/bridgingTable';
const { Option } = Select;

class SetUpBridgingPanel extends Component {
  state = {
    selectRoofIndex: 0,
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const pitchedRoofSelect = this.props.workingBuilding.type === 'PITCHED' ?
    (
      <Form.Item>
        <Row>
          <Col span={20} offset={2}>
          {getFieldDecorator('roofIndex', {
            rules: [{
              required: this.props.workingBuilding.type === 'PITCHED',
              message: 'Please select one'
            }]
          })(
            <Select
              placeholder='Select a pitched roof'
              onChange={(roofInd) => {
                this.setState({selectRoofIndex: roofInd});
                if(
                  !Object.keys(this.props.roofSpecInverters)
                  .includes(roofInd.toString()) && this.state.tab === 'auto'
                )
                  this.props.calculateAutoInverter(roofInd);
              }}
            >
              {Object.keys(this.props.roofSpecParams).map((k,ind) =>
                <Option
                  key={k}
                  value={k}
                >
                  {`Pitched Roof ${parseInt(k)+1}`}
                </Option>
              )}
            </Select>
          )}
          </Col>
        </Row>
      </Form.Item>
    ) :
    null;

    return (
      <div>
        <Row type="flex" justify="center">
          <h3><FormattedMessage id='setupBridging' /></h3>
        </Row>
        <Form>
          {pitchedRoofSelect}
        </Form>
        <BridgingTable roofIndex={this.state.selectRoofIndex} />
        <Row type="flex" justify="center">

          <Button
            type='primary'
            shape='round'
            size='large'
            onClick = {() => {
              console.log('finish building')
              this.props.bindPVPanels();
              this.props.bindInverters();
            }}
          >
            <FormattedMessage id='finish_bridging' /> <Icon type='check' />
          </Button>
        </Row>
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
    roofSpecInverters: state.undoableReducer.present.editingWiringManager
      .roofSpecInverters,
    projectInfo: state.projectManagerReducer.projectInfo,

    normalKeepout: state.undoableReducer.present.drawingKeepoutPolygonManagerReducer.normalKeepout,
    passageKeepout: state.undoableReducer.present.drawingKeepoutPolygonManagerReducer.passageKeepout,
    treeKeepout: state.undoableReducer.present.drawingKeepoutPolygonManagerReducer.treeKeepout,
    userPanels: state.undoableReducer.present.editingPVPanelManagerReducer.userPanels,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    bindPVPanels: () => dispatch(actions.bindPVPanels()),
    bindInverters: () => dispatch(actions.bindInverters())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'setupBridgingPanel' })(SetUpBridgingPanel));
