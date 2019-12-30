import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ConfigProvider,
  Table,
  Divider,
  Row,
  Col,
  Button,
  Progress,
  Dropdown,
  Menu,
  Icon
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNetworkWired,
  faArrowsAlt
} from '@fortawesome/pro-light-svg-icons'

import {
  emptyListTemplate
} from '../../../../../components/ui/EmptyTemplate/emptyListTemplate';
import * as actions from '../../../../../store/actions/index';

class BridgingTable extends Component {

  columns = [
    {
      title: 'Inverter',
      dataIndex: 'inverterName',
      key: 'name',
      width: '70%',
      ellipsis: true
    },
    {
      title: 'Action',
      dataIndex: '',
      key: '',
      width: '30%',
      render: (text, record, inverterInd) => ([
        this.props.roofSpecInverters[this.props.roofIndex][inverterInd]
        .polygon ?
        <Button
          key='placeInverter'
          type="primary"
          shape='circle'
          size='small'
          ghost={this.props.uiState === 'READY_DRAG_INVERTER'? false : true}
          disabled={
            (this.props.uiState === 'EDIT_BRIDGING' ||
            this.props.uiState === 'DRAG_BRIDGING') ||
            (this.props.uiState === 'READY_DRAG_INVERTER' &&
            this.props.roofIndex !== this.props.editingRoofIndex &&
            inverterInd !== this.props.editingInverterIndex) ?
            true:
            false
          }
          icon='edit'
          onClick={() => {
            this.props.setBridgingRoofAndInverter(
              this.props.roofIndex, inverterInd
            );
            this.props.uiState === 'READY_DRAG_INVERTER' ?
            this.props.setUIStateSetUpBridging() :
            this.props.setUIStateReadyDragInverter();
          }}
        /> :
        <Button
          key='placeInverter'
          type="primary"
          shape='circle'
          size='small'
          ghost={this.props.uiState !== 'PLACE_INVERTER'}
          disabled={this.props.uiState !== 'SETUP_BRIDGING'}
          icon='plus'
          onClick={() => {
            this.props.setBridgingRoofAndInverter(
              this.props.roofIndex, inverterInd
            );
            this.props.setUIStatePlaceInverter();
          }}
        />,
        <Divider key='divider' type="vertical" />,
        <Button
          key='bridging'
          type="primary"
          shape='circle'
          size='small'
          ghost={
            (this.props.uiState === 'EDIT_BRIDGING' ||
            this.props.uiState === 'DRAG_BRIDGING') ? false : true
          }
          disabled={
            (this.props.uiState === 'READY_DRAG_INVERTER' ||
            this.props.uiState === 'DRAG_INVERTER') ||
            !this.props.roofSpecInverters[this.props.roofIndex][inverterInd]
            .polygon ||
            !this.props.roofSpecInverters[this.props.roofIndex][inverterInd]
            .wiring[0].allPanels ||
            ((this.props.uiState === 'EDIT_BRIDGING' ||
            this.props.uiState === 'DRAG_BRIDGING') &&
            this.props.roofIndex !== this.props.editingRoofIndex &&
            inverterInd !== this.props.editingInverterIndex)
          }
          onClick={() => {
            if (
              this.props.roofSpecInverters[this.props.roofIndex][inverterInd]
              .bridging.length === 0
            ) {
              this.props.bridging(this.props.roofIndex, inverterInd)
            } else {
              if(this.props.uiState === 'SETUP_BRIDGING') {
                this.props.setBridgingRoofAndInverter(
                  this.props.roofIndex, inverterInd
                );
                this.props.setUIStateEditBridging();
              } else {
                this.props.setUIStateSetUpBridging();
              }
            }
          }}
        >
          {
            this.props.roofSpecInverters[this.props.roofIndex][inverterInd]
            .bridging.length === 0 ?
            <FontAwesomeIcon icon={faNetworkWired} /> :
            <FontAwesomeIcon icon={faArrowsAlt} />
          }
        </Button>
      ])
    },
  ];

  render () {
    return (
      <Row>
        <Col span={24}>
          <ConfigProvider renderEmpty={() => emptyListTemplate({type: 'Inverters'})}>
            <Table
              size='middle'
              pagination={false}
              columns={this.columns}
              dataSource={this.props.roofSpecInverters[this.props.roofIndex]}
              rowKey={record => record.entityId}
            />,
          </ConfigProvider>
        </Col>
      </Row>
    );
  };
};

const mapStateToProps = state => {
  return {
    roofSpecInverters:
      state.undoableReducer.present.editingWiringManager.roofSpecInverters,
    roofSpecParams:
      state.undoableReducer.present.editingPVPanelManagerReducer.roofSpecParams,
    uiState:
      state.undoableReducer.present.uiStateManagerReducer.uiState,
    editingWiringIndex:
      state.undoableReducer.present.editingWiringManager.editingWiringIndex,
    editingInverterIndex:
      state.undoableReducer.present.editingWiringManager.editingInverterIndex,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUIStatePlaceInverter: () => dispatch(
      actions.setUIStatePlaceInverter()
    ),
    setUIStateEditBridging: () => dispatch(actions.setUIStateEditBridging()),
    setBridgingRoofAndInverter: (roofIndex, inverterInd) => dispatch(
      actions.setBridgingRoofAndInverter(roofIndex, inverterInd)
    ),
    bridging: (roofIndex, inverterIndex) => dispatch(
      actions.bridging(roofIndex, inverterIndex)
    ),
    setUIStateSetUpBridging: () => dispatch(
      actions.setUIStateSetUpBridging()
    ),
    setUIStateReadyDragInverter: () => dispatch(
      actions.setUIStateReadyDragInverter()
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BridgingTable);
