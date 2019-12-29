import React, { Component } from 'react';
import { Card, Col, Table } from "antd";
import { connect } from "react-redux";
import Numeral from "numeral";

class Equipment extends Component {
    render () {
        return (
            <Col span={this.props.span * 6} style={{ padding: 8 }}>
                <Card
                    title={<b>Equipment</b>}
                    style={{ height: '100%', cursor: 'default' }}
                    hoverable={ true }
                    loading={ !this.props.metadata.loaded }
                >
                    { this.props.metadata.loaded &&
                    <Table dataSource={this.props.table} bordered={true} pagination={false} size='small'>
                        <Table.Column sorter={(a, b) => (a.device > b.device)} title="Device" dataIndex="device" key="device" render={text => <b>{text}</b>} />
                        <Table.Column sorter={(a, b) => (a.model > b.model)} title="Model" dataIndex="model" key="model" />
                        <Table.Column title="Quantity" dataIndex="quantity" key="quantity" align="right" />
                        <Table.Column sorter={(a, b) => (a.capital - b.capital)} title="Capital Cost" dataIndex="capital" key="capital" align="right" render={(value) => Numeral(value).format('$ 0,0.0') } />
                    </Table> }
                </Card>
            </Col>
        )
    }
}


// pass data to props
function mapStateToProps(state) {
    if (state.undoableReducer.present.reportManager.metadata.loaded) {
        return {
            metadata: state.undoableReducer.present.reportManager.metadata,
            table: [
                {
                    key: '1',
                    device: 'Panel',
                    model: state.undoableReducer.present.reportManager.metadata.option.data.Panel.Model,
                    quantity: state.undoableReducer.present.reportManager.metadata.option.data.Panel.Quantity,
                    capital: state.undoableReducer.present.reportManager.metadata.option.data.Panel.Cost,
                },
                {
                    key: '2',
                    device: 'Inverter',
                    model: state.undoableReducer.present.reportManager.metadata.option.data.Inverter.Model,
                    quantity: state.undoableReducer.present.reportManager.metadata.option.data.Inverter.Quantity,
                    capital: state.undoableReducer.present.reportManager.metadata.option.data.Inverter.Cost,
                },
                {
                    key: '3',
                    device: 'Wire',
                    model: state.undoableReducer.present.reportManager.metadata.option.data.Wire.Model,
                    quantity: Numeral(state.undoableReducer.present.reportManager.metadata.option.data.Wire.Quantity).format('0,0.0') + ' M',
                    capital: state.undoableReducer.present.reportManager.metadata.option.data.Wire.Cost,
                },
            ],
        }
    }
    return { metadata: state.undoableReducer.present.reportManager.metadata }
}

export default connect(mapStateToProps)(Equipment);
