import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ConfigProvider,
  Table,
  Card,
  Row,
  Col,
  Button,
  Progress
} from 'antd';

import {
  emptyListTemplate
} from '../../../../../components/ui/EmptyTemplate/emptyListTemplate';

class InverterTable extends Component {

  expandedRowRender = (inverter) => {
    console.log(inverter)
    const columns = [
      {
        title: 'Status',
        key: 'state',
        width: '60%',
        render: () => (
          <Progress
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            percent={50}
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
        render: () => (
          <Button> edit </Button>
        ),
      },
    ];

    const data = inverter.wiring;
    return (
      <Table
        size="small"
        showHeader={false}
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey={record => record}
      />
    );
  };

  columns = [
    {
      title: 'Inverter',
      dataIndex: 'inverterName',
      key: 'name',
      width: '45%',
      ellipsis: true
    },
    {
      title: 'P/S',
      dataIndex: 'panelPerString',
      key: 'panelPerString',
      width: '25%',
      ellipsis: true,
      align: 'center'
    },
    {
      title: 'S/I',
      dataIndex: 'stringPerInverter',
      key: 'stringPerInverter',
      width: '25%',
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
              size="small"
              pagination={false}
              columns={this.columns}
              expandedRowRender={inverter => this.expandedRowRender(inverter)}
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

export default connect(mapStateToProps)(InverterTable);
