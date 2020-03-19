import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ConfigProvider,
  Table,
  Row,
  Col,
  Button,
  Icon
} from 'antd';
import { FormattedMessage } from 'react-intl';

import {
  emptyListTemplate
} from '../../../../../components/ui/EmptyTemplate/emptyListTemplate';
import * as actions from '../../../../../store/actions/index';

class PlaceInverterTable extends Component {

  expandedRowRender = (inverter, inverterInd) => {
    return [
      (
        this.props.entireSpecInverters[inverterInd].polygon ?
        <Button
          key='placeInverter'
          type="primary"
          size='small'
          ghost={this.props.uiState === 'READY_DRAG_INVERTER'? false : true}
          disabled={
            this.props.uiState === 'SETUP_BRIDGING' ||
            (this.props.uiState === 'READY_DRAG_INVERTER' &&
            inverterInd === this.props.editingInverterIndex) ?
            false:
            true
          }
          onClick={() => {
            this.props.setBridgingInverter(inverterInd);
            this.props.uiState === 'READY_DRAG_INVERTER' ?
            this.props.setUIStateSetUpBridging() :
            this.props.setUIStateReadyDragInverter();
          }}
        ><FormattedMessage id='moveInverter' /></Button> :
        <Button
          key='placeInverter'
          type="primary"
          size='small'
          ghost={this.props.uiState !== 'PLACE_INVERTER'}
          disabled={this.props.uiState !== 'SETUP_BRIDGING'}
          onClick={() => {
            this.props.setBridgingInverter(inverterInd);
            this.props.setUIStatePlaceInverter();
          }}
        ><FormattedMessage id='placeInverter' /></Button>
      ),
      (<Icon key='leftarrow1' type="arrow-right" />),
      (
        <Button
          key='readyDrawMainbridge'
          type="primary"
          size='small'
          ghost={this.props.uiState === 'READY_DRAW_MAINBRIDGE'? false : true}
          disabled={
            this.props.uiState === 'SETUP_BRIDGING' ?
            false:
            true
          }
          onClick={() => {
            this.props.setBridgingInverter(inverterInd);
            this.props.uiState === 'DRAW_MAIN_BRIDGING' ?
            this.props.setUIStateSetUpBridging() :
            this.props.setUIStateDrawMainBridging();
          }}
        ><FormattedMessage id='drawMainBridge' /></Button>
      )
    ];
  };

  columns = [
    {
      title: <FormattedMessage id='inverter_name' />,
      dataIndex: 'inverterName',
      key: 'name',
      width: '100%',
      ellipsis: true,
      align: 'center'
    }
  ];

  render () {
    return (
      <Row>
        <Col span={24}>
          <ConfigProvider renderEmpty={() =>
            emptyListTemplate({type: 'Inverters'})
          }>
            <Table
              size='middle'
              pagination={false}
              columns={this.columns}
              expandedRowRender={
                (inverter, inverterInd) =>
                this.expandedRowRender(inverter, inverterInd)
              }
              dataSource={this.props.entireSpecInverters}
              rowKey={record => record.entityId}
              onRow={(record, inverterInd) => {
                return {
                  onMouseEnter: event => {
                    if (record.wiring.every(obj => obj.polyline)) {
                      this.props.highLightInverter(inverterInd)
                    }
                  },
                  onMouseLeave: event => {
                    if (record.wiring.every(obj => obj.polyline)) {
                      this.props.deHighLightInverter(inverterInd)
                    }
                  },
                }
              }}
            />,
          </ConfigProvider>
        </Col>
      </Row>
    );
  };
};

const mapStateToProps = state => {
  return {
    entireSpecInverters:
      state.undoable.present.editingWiringManager.entireSpecInverters,
    roofSpecParams:
      state.undoable.present.editingPVPanelManager.roofSpecParams,
    uiState:
      state.undoable.present.uiStateManager.uiState,
    editingWiringIndex:
      state.undoable.present.editingWiringManager.editingWiringIndex,
    editingInverterIndex:
      state.undoable.present.editingWiringManager.editingInverterIndex,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUIStatePlaceInverter: () => dispatch(
      actions.setUIStatePlaceInverter()
    ),
    setUIStateEditBridging: () => dispatch(actions.setUIStateEditBridging()),
    setBridgingInverter: (inverterInd) => dispatch(
      actions.setBridgingInverter(inverterInd)
    ),
    bridging: (inverterIndex) => dispatch(
      actions.bridging(inverterIndex)
    ),
    setUIStateSetUpBridging: () => dispatch(
      actions.setUIStateSetUpBridging()
    ),
    setUIStateReadyDragInverter: () => dispatch(
      actions.setUIStateReadyDragInverter()
    ),

    setUIStateDrawMainBridging: () => dispatch(
      actions.setUIStateDrawMainBridging()
    ),

    highLightInverter: (inverterInd) => dispatch(
      actions.highLightInverter(inverterInd)
    ),
    deHighLightInverter: (inverterInd) => dispatch(
      actions.deHighLightInverter(inverterInd)
    ),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceInverterTable);
