import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ConfigProvider,
  Table,
  Row,
  Col,
  Button,
} from 'antd';
import { FormattedMessage } from 'react-intl';

import {
  emptyListTemplate
} from '../../../../../components/ui/EmptyTemplate/emptyListTemplate';
import * as actions from '../../../../../store/actions/index';

class PlaceInverterTable extends Component {

  columns = [
    {
      title: <FormattedMessage id='inverterName' />,
      dataIndex: 'inverterName',
      key: 'name',
      width: '80%',
      ellipsis: true
    },
    {
      title: <FormattedMessage id='Action' />,
      dataIndex: '',
      key: '',
      width: '20%',
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
        />
      ])
    },
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
              dataSource={this.props.roofSpecInverters[this.props.roofIndex]}
              rowKey={record => record.entityId}
              onRow={record => {
                return {
                  onMouseEnter: event => {console.log(event); console.log(record)},
                  onMouseLeave: event => {console.log(event);console.log(record)},
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
    roofSpecInverters:
      state.undoable.present.editingWiringManager.roofSpecInverters,
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

export default connect(mapStateToProps, mapDispatchToProps)(PlaceInverterTable);
