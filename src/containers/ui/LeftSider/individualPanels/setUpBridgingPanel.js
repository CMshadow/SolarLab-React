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

  generateReportJSON = (building, roofIndex) => {
    const matchPanelInfo = this.props.userPanels.find(info =>
      info.panelID === building.pvParams[roofIndex].panelID
    );
    matchPanelInfo.parallelCells = Number(matchPanelInfo.parallelCells);
    matchPanelInfo.aisc = Number(matchPanelInfo.aisc);
    matchPanelInfo.voco = Number(matchPanelInfo.voco);
    matchPanelInfo.bvmpo = Number(matchPanelInfo.bvmpo);
    matchPanelInfo.isco = Number(matchPanelInfo.isco);
    matchPanelInfo.panelLength = Number(matchPanelInfo.panelLength);
    matchPanelInfo.vmpo = Number(matchPanelInfo.vmpo);
    matchPanelInfo.cost = Number(matchPanelInfo.cost);
    matchPanelInfo.panelWidth = Number(matchPanelInfo.panelWidth);
    matchPanelInfo.seriesCells = Number(matchPanelInfo.seriesCells);
    matchPanelInfo.bvoco = Number(matchPanelInfo.bvoco);
    matchPanelInfo.ixxo = Number(matchPanelInfo.ixxo);
    matchPanelInfo.impo = Number(matchPanelInfo.impo);
    matchPanelInfo.ixo = Number(matchPanelInfo.ixo);

    const inverter_solution_collection =
      Object.keys(this.props.roofSpecInverters).flatMap(roofIndex =>
      this.props.roofSpecInverters[roofIndex].map(inverter => {
        const matchInverterInfo = this.props.userInverters.find(info =>
          info.inverterID === inverter.inverterId
        );
        matchInverterInfo.vdcmax = Number(matchInverterInfo.vdcmax);
        matchInverterInfo.pdco = Number(matchInverterInfo.pdco);
        matchInverterInfo.mpptHigh = Number(matchInverterInfo.mpptHigh);
        matchInverterInfo.pso = Number(matchInverterInfo.pso);
        matchInverterInfo.mpptLow = Number(matchInverterInfo.mpptLow);
        matchInverterInfo.vdcmin = Number(matchInverterInfo.vdcmin);
        matchInverterInfo.vs0 = Number(matchInverterInfo.vs0);
        matchInverterInfo.cost = Number(matchInverterInfo.cost);
        matchInverterInfo.vac = Number(matchInverterInfo.vac);
        matchInverterInfo.pnt = Number(matchInverterInfo.pnt);
        matchInverterInfo.paco = Number(matchInverterInfo.paco);
        matchInverterInfo.vdco = Number(matchInverterInfo.vdco);
        matchInverterInfo.idcmax = Number(matchInverterInfo.idcmax);

        const wirings = [];
        const bridgings = [];
        inverter.bridging.filter(bridging =>
          bridging.connectedWiringIndex.length > 0
        ).forEach((bridging, bridgeInd) => {
          const temp = [];
          bridging.connectedWiringIndex.forEach((wiringIndex, i) => {
            wirings.push({wiring_length: [
              inverter.wiring[wiringIndex].polyline.polylineLength(),
              bridgeInd,
              i
            ]});
            temp.push(bridging.mainPolyline.polylineLength());
          })
          bridgings.push({
            bridge_polyline_length: temp
          })
        })

        return {
          model: inverter.inverterName,
          inverter_serial_number: inverter.serial,
          panels_per_string: inverter.panelPerString,
          string_per_inverter: inverter.stringPerInverter,
          model_full_info: {
            ...matchInverterInfo,
            id: matchInverterInfo.inverterID,
            model: matchInverterInfo.inverterName,
            createdByUser: matchInverterInfo.userID,
          },
          wiring: wirings,
          bridging: bridgings
        }
      })
    )

    return {
      project_name: '演示项目',
      project_id: '0000-0000-0000-0001',
      username: '演示用户',
      address: '',
      project_created_at: '2020-01-01T10:00:00Z',
      project_updated_at: '2020-01-01T10:00:00Z',
      building_id: building.entityId,
      name: building.name,
      data: {
        building: {
          pv_panel_parameters: {
            tilt_angle: building.pvParams[roofIndex].tilt,
            azimuth: building.pvParams[roofIndex].azimuth,
            mode: building.pvParams[roofIndex].mode === 'individual' ? 'single' : 'multi',
            model_full_info: {
              ...matchPanelInfo,
              id: matchPanelInfo.panelID,
              model: matchPanelInfo.panelName,
              length: matchPanelInfo.panelLength,
              width: matchPanelInfo.panelWidth,
              createdByUser: matchPanelInfo.userID,
            }
          },
          inverter_wiring: {
            inverter_solution_collection: inverter_solution_collection
          },
          Time: {
            year: 2018,
            summer_month: 6,
            winter_month: 12,
            month: 6,
            day: 22,
            hour1: 10,
            hour2: 15,
            UTCOffset: 0
          },
        }
      }
    }
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