import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Icon,
  Select,
  Row,
  Col,
  Button,
  Divider,
} from 'antd';
import { FormattedMessage } from 'react-intl';

import * as actions from '../../../../store/actions/index';
import PlaceInverterTable from './wiringAndBridging/placeInverterTable';
const { Option } = Select;

class SetUpBridgingPanel extends Component {
  state = {
    selectRoofIndex: 0,
  }

  render() {
    return (
      <div style={{padding: '10px 10px 20px', overflow: 'auto'}}>
        <Divider><FormattedMessage id='Step_1' /></Divider>
        <PlaceInverterTable roofIndex={this.state.selectRoofIndex} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    uiState:
      state.undoable.present.uiStateManager.uiState,
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
    roofSpecInverters:
      state.undoable.present.editingWiringManager.roofSpecInverters,
    projectInfo:
      state.undoable.present.projectManager.projectInfo,

    normalKeepout:
      state.undoable.present.drawingKeepoutPolygonManager.normalKeepout,
    passageKeepout:
      state.undoable.present.drawingKeepoutPolygonManager.passageKeepout,
    treeKeepout:
      state.undoable.present.drawingKeepoutPolygonManager.treeKeepout,
    userPanels:
      state.undoable.present.editingPVPanelManager.userPanels,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUIStateIdel: () => dispatch(actions.setUIStateIdel()),
    bindPVPanels: () => dispatch(actions.bindPVPanels()),
    bindInverters: () => dispatch(actions.bindInverters())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'setupBridgingPanel' })(SetUpBridgingPanel));
