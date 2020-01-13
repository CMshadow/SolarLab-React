import { Menu, Avatar } from 'antd';
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import * as actions from '../../../store/actions/index';
import './NavigationBar.css';

const { SubMenu } = Menu;

class NavigationBar extends Component{
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

  HomePage = () => {
    if (this.props.history.location.pathname !=='/')
      this.props.history.push('/');
  }

  SketchDiagramHandler = () => {
    if (this.props.history.location.pathname !=='/SketchDiagram')
      this.props.history.push('/SketchDiagram');
  }

  ModelingSwitchHandler = () => {
    if (this.props.history.location.pathname !=='/Modeling')
      this.props.history.push('/Modeling');
  }

  ReportSwitchHandler = () => {
    if (this.props.history.location.pathname !=='/Report') {
      const requestJSON = this.generateReportJSON(this.props.workingBuilding, 0);
      this.props.postBuildingData(requestJSON);
      this.props.history.push('/Report');
    }
  }

  SingleLineDiagramSwitchHandler = () => {
    if (this.props.history.location.pathname !=='/SingleLineDigram')
      this.props.history.push('/SingleLineDigram');
  }

  render() {
    return (
      <Menu
        theme='dark'
        mode='horizontal'
        className='menu'
        defaultSelectedKeys={
          this.props.history.location.pathname === '/' ? ['1'] :
          this.props.history.location.pathname === '/Modeling' ? ['2'] :
          this.props.history.location.pathname === '/SketchDiagram' ? ['3'] :
          this.props.history.location.pathname === '/SingleLineDigram' ? ['4'] : ['5']
        }
      >
        <Menu.Item
          key='1'
          onClick={this.HomePage}
        >
          <FormattedMessage id='home' />
        </Menu.Item>
        <Menu.Item
          key='2'
          onClick={this.ModelingSwitchHandler}
        >
          <FormattedMessage id='modeling' />
        </Menu.Item>
        <Menu.Item
          key='3'
          onClick={this.SketchDiagramHandler}
        >
          <FormattedMessage id='twoD_diagram' />
        </Menu.Item>
        <Menu.Item
          key='4'
          onClick={this.SingleLineDiagramSwitchHandler}
        >
            <FormattedMessage id='single_line_diagram' />
          </Menu.Item>
        <Menu.Item
          key='5'
          onClick={this.ReportSwitchHandler}
        >
          <FormattedMessage id='report' />
        </Menu.Item>
        <SubMenu
          title={
            <Avatar
              style={{backgroundColor: '#f56a00', verticalAlign: 'middle'}}
            >U</Avatar>
          }
          style={{ float: 'right' }}
        >
          <Menu.Item key="setting:3">Option 1</Menu.Item>
          <Menu.Item key="setting:4">Option 2</Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

const mapStateToProps = state => {
  return {
    workingBuilding: state.buildingManagerReducer.workingBuilding,
    userInverters: state.undoableReducer.present.editingWiringManager.userInverters,
    userPanels: state.undoableReducer.present.editingPVPanelManagerReducer.userPanels,
    roofSpecInverters: state.undoableReducer.present.editingWiringManager
      .roofSpecInverters,
    roofSpecParams: state.undoableReducer.present.editingPVPanelManagerReducer
      .roofSpecParams,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    postBuildingData: (json) => dispatch(actions.postBuildingData(json)),
    request: () => {
      dispatch(actions.request_metadata());
      dispatch(actions.request_loss());
      dispatch(actions.request_electricity_bill());
      dispatch(actions.request_pv_production());
      dispatch(actions.request_cash_flow());
      dispatch(actions.request_board_working_condition_left());
      dispatch(actions.request_board_working_condition_center());
      dispatch(actions.request_board_working_condition_right());
      dispatch(actions.request_energy());
      dispatch(actions.request_weather());
    }
 };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(NavigationBar));
