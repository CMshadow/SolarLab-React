import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ConfigProvider,
  Table,
  Card,
  Row,
  Col,
  Button,
  Progress,
  Dropdown,
  Menu,
  Icon
} from 'antd';

import {
  emptyListTemplate
} from '../../../../../components/ui/EmptyTemplate/emptyListTemplate';
import * as actions from '../../../../../store/actions/index';

class InverterTable extends Component {

  menu = (
    <Menu>
      <Menu.Item key="1">
        Manual
      </Menu.Item>
    </Menu>
  );

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
              Math.ceil(inverter.panelPerString / wiring.allPanels.length)
            }
            size="small"
            status="active"
          />
        ),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: '40%',
        render: (wiring, record, wiringInd) => (
          <Dropdown.Button
            overlay={this.menu}
            icon={<Icon type="down" />}
            onClick = {() => {
              this.props.autoWiring(this.props.roofIndex, inverterInd, wiringInd)
            }}
          >
            Auto
          </Dropdown.Button>
        ),
      },
    ];

    const data = inverter.wiring;
    return (
      <Table
        size="middle"
        showHeader={false}
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey={record => record.entityId}
      />
    );
  };

  columns = [
    {
      title: 'Inverter',
      dataIndex: 'inverterName',
      key: 'name',
      width: '60%',
      ellipsis: true
    },
    {
      title: 'P/S',
      dataIndex: 'panelPerString',
      key: 'panelPerString',
      width: '20%',
      ellipsis: true,
      align: 'center'
    },
    {
      title: 'S/I',
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
          <ConfigProvider renderEmpty={() => emptyListTemplate({type: 'Inverters'})}>
            <Table
              size="middle"
              pagination={false}
              columns={this.columns}
              expandedRowRender={
                (inverter, inverterInd) =>
                this.expandedRowRender(inverter, inverterInd)
              }
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    autoWiring: (roofInd, inverterInd, wiringInd) => dispatch(
      actions.autoWiring(roofInd, inverterInd, wiringInd)
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InverterTable);
