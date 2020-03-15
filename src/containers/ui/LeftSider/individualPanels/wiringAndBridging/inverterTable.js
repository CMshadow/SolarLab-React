import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ConfigProvider,
  Table,
  Row,
  Col,
  Button,
  Progress,
  Dropdown,
  Menu,
  Icon
} from 'antd';
import { FormattedMessage } from 'react-intl';

import {
  emptyListTemplate
} from '../../../../../components/ui/EmptyTemplate/emptyListTemplate';
import * as actions from '../../../../../store/actions/index';

class InverterTable extends Component {

  expandedRowRender = (inverter, inverterInd) => {
    const columns = [
      {
        title: 'Status',
        key: 'state',
        width: '60%',
        render: wiring => (
          <Progress
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            percent={
              wiring.allPanels.length === 0 ?
              0 :
              Math.ceil(wiring.allPanels.length / inverter.panelPerString * 100)
            }
            size='small'
            status={
              inverter.panelPerString === wiring.allPanels.length ?
              'success' :
              'active'
            }
          />
        ),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: '40%',
        render: (wiring, record, wiringInd) => {
          const menu = (
            <Menu>
              <Menu.Item
                key='1'
                onClick = {() => {
                  this.props.setUIStateManualWiring();
                  this.props.manualWiring(inverterInd, wiringInd);
                }}
              >
                <FormattedMessage id='wiring_manual' />
              </Menu.Item>
            </Menu>
          );
          if (record.allPanels.length === 0) {
            if (
              this.props.roofSpecParams[
                Object.keys(this.props.roofSpecParams)[0]
              ].mode === 'individual'
            ) {
              return (
                <Dropdown.Button
                  overlay={menu}
                  icon={<Icon type='down' />}
                  disabled={
                    (this.props.uiState === 'EDITING_WIRING' ||
                    this.props.uiState === 'DRAGGING_WIRING') &&
                    (wiringInd !== this.props.editingWiringIndex ||
                    inverterInd !== this.props.editingInverterIndex)
                  }
                  onClick = {() => {
                    this.props.autoWiring(inverterInd, wiringInd);
                  }}
                >
                  <FormattedMessage id='wiring_auto' />
                </Dropdown.Button>
              )
            } else {
              return (
                <Button
                  disabled={
                    (this.props.uiState === 'EDITING_WIRING' ||
                    this.props.uiState === 'DRAGGING_WIRING') &&
                    (wiringInd !== this.props.editingWiringIndex ||
                    inverterInd !== this.props.editingInverterIndex)
                  }
                  onClick = {() => {
                    this.props.autoWiring(inverterInd, wiringInd);
                  }}
                >
                  <FormattedMessage id='wiring_auto' />
                </Button>
              )
            }
          } else {
            return (
              <Button
                disabled={
                  (this.props.uiState === 'EDITING_WIRING' ||
                  this.props.uiState === 'DRAGGING_WIRING') &&
                  (wiringInd !== this.props.editingWiringIndex ||
                  inverterInd !== this.props.editingInverterIndex)
                }
                onClick = {() => {
                  if (this.props.uiState === 'SETUP_WIRING') {
                    this.props.setUIStateEditingWiring();
                    this.props.editWiring(inverterInd, wiringInd);
                  } else {
                    this.props.setUIStateSetUpWiring();
                    this.props.stopEditWiring();
                  }
                }}
              >
                {
                  this.props.uiState === 'SETUP_WIRING' ||
                  wiringInd !== this.props.editingWiringIndex ||
                  inverterInd !== this.props.editingInverterIndex ?
                  <FormattedMessage id='edit_wiring' /> :
                  <FormattedMessage id='stop_editing_wiring' />
                }
              </Button>
            );
          }
        },
      },
    ];

    const data = inverter.wiring;
    return (
      <Table
        size='middle'
        showHeader={false}
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey={record => record.entityId}
        onRow={(record, index) => {
          return {
            onMouseEnter: event => {
              if (record.polyline) {
                this.props.highLightWiring(inverterInd, index)
              }
            },
            onMouseLeave: event => {
              if (record.polyline) {
                this.props.deHighLightWiring(inverterInd, index)
              }
            },
          }
        }}
      />
    );
  };

  columns = [
    {
      title: <FormattedMessage id='inverter_name' />,
      dataIndex: 'inverterName',
      key: 'name',
      width: '60%',
      ellipsis: true
    },
    {
      title: <FormattedMessage id='panel_per_string' />,
      dataIndex: 'panelPerString',
      key: 'panelPerString',
      width: '20%',
      ellipsis: true,
      align: 'center'
    },
    {
      title: <FormattedMessage id='string_per_inverter' />,
      dataIndex: 'stringPerInverter',
      key: 'stringPerInverter',
      width: '20%',
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
    autoWiring: (inverterInd, wiringInd) => dispatch(
      actions.autoWiring(inverterInd, wiringInd)
    ),
    manualWiring: (roofInd, inverterInd, wiringInd) => dispatch(
      actions.manualWiring(roofInd, inverterInd, wiringInd)
    ),
    editWiring: (roofInd, inverterInd, wiringInd) => dispatch(
      actions.editWiring(roofInd, inverterInd, wiringInd)
    ),
    stopEditWiring: () => dispatch(actions.stopEditWiring()),
    setUIStateEditingWiring: () => dispatch(
      actions.setUIStateEditingWiring()
    ),
    setUIStateSetUpWiring: () => dispatch(
      actions.setUIStateSetUpWiring()
    ),
    setUIStateManualWiring: () => dispatch(
      actions.setUIStateManualWiring()
    ),
    highLightWiring: (roofInd, inverterInd, wiringInd) => dispatch(
      actions.highLightWiring(roofInd, inverterInd, wiringInd)
    ),
    deHighLightWiring: (roofInd, inverterInd, wiringInd) => dispatch(
      actions.deHighLightWiring(roofInd, inverterInd, wiringInd)
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InverterTable);
