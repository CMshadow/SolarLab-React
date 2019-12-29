import React, { Component } from 'react';
import { connect } from "react-redux";
import { Layout, Card, Row, Col, Typography, Divider, Descriptions, Table, Statistic } from 'antd';
import ReactEcharts from "echarts-for-react";
import logo from '../image/logo-black.png';
import panel from "../resource/panel.png";
import dollar from "../resource/dollar.png";
import factory from "../resource/factory.png";
import house from "../resource/house.png";
import UtilFunctions from "../../../infrastructure/util/UtilFunctions";

import './print-preview.css';
import Numeral from "numeral";

const { Title, Paragraph } = Typography;

const displayModeTable = {
    year: {
        monthSelect: false,
        daySelect: false,
        weather: true,
        condition: false,
        energy: true,
    },
    month: {
        monthSelect: true,
        daySelect: false,
        weather: true,
        condition: false,
        energy: true,
    },
    day: {
        monthSelect: true,
        daySelect: true,
        weather: true,
        condition: true,
        energy: true,
    }
};


class PrintPreview extends Component {
    render () {
        return (
            <Layout style={{ backgroundColor: 'transparent', display: 'block', zoom: '50%' }}>
                <Paragraph>
                    <img src={logo} style={{ width: 100, height: 'auto', marginRight: 10 }} alt="logo" />
                    <Title level={4} type="secondary">Powered by Albedo</Title>
                    <Divider />
                </Paragraph>


                <Title style={{ textAlign: 'center' }}>{ this.props.metadata.loaded ? this.props.metadata.option.data['Project_Name'] : 'Loading...' }</Title>
                <Title level={2}>Overview</Title>
                <Paragraph>
                    { this.props.metadata.loaded &&
                    <Descriptions size='small' bordered>
                        <Descriptions.Item label={<b>Project Name</b>} >{ this.props.metadata.option.data['Project_Name'] }</Descriptions.Item>
                        <Descriptions.Item label={<b>Address</b>} >{ this.props.metadata.option.data['Address'] }</Descriptions.Item>
                        <Descriptions.Item label={<b>System Efficiency</b>} >{ Numeral(this.props.metadata.option.data['System_Efficiency']).format('0,0.0') }%</Descriptions.Item>
                        <Descriptions.Item label={<b>kWh/kWp</b>} >{ Numeral(this.props.metadata.option.data['kWh/kWp']).format('0,0.0') }</Descriptions.Item>
                        <Descriptions.Item label={<b>LCOE</b>} >{ Numeral(this.props.metadata.option.data['LCOE']).format('0,0.0') }</Descriptions.Item>
                        <Descriptions.Item label={<b>Payback Period</b>} >{ Numeral(this.props.metadata.option.data['Payback_period']).format('0,0.0') } years</Descriptions.Item>
                        <Descriptions.Item label={<b>Updated by</b>} >{ UtilFunctions.isoStringParser(this.props.metadata.option.data['Project_Updated_Time']) }</Descriptions.Item>
                    </Descriptions> }
                </Paragraph>


                <Title level={2}>Layout</Title>
                <Paragraph>
                    <img
                        src="/mock/mock_image.jpg"
                        alt="Layout"
                        className="preserve image"
                    />
                </Paragraph>


                <Title level={2}>Statistics</Title>
                <Paragraph>
                    <Row type="flex">
                        {
                            this.props.metadata.loaded &&
                            ['panel', 'dollar', 'factory', 'house'].map( (type) =>
                                <Col key={type} span={6} style={{ padding: 8 }}>
                                    <Card style={{ height: '100%', cursor: 'default', textAlign: 'center' }} bordered={false}>
                                        <img style={{height: 36, margin: 5}} src={this.props.icon[type].image} alt={this.props.type} />
                                        <Statistic
                                            title={this.props.icon[type].title}
                                            value={ Numeral(this.props.icon[type].value).format('0.0 a').split(' ')[0] }
                                            suffix={ Numeral(this.props.icon[type].value).format('0.0 a').split(' ')[1] + this.props.icon[type].suffix}
                                        />
                                    </Card>
                                </Col>
                            )
                        }
                    </Row>
                </Paragraph>


                <Title level={2}>Finance</Title>
                <Title level={3}>Project Cash Flow</Title>
                <Paragraph>
                    { this.props.cashFlow.loaded &&
                    <ReactEcharts
                        className="preserve chart"
                        option={ {...this.props.cashFlow.option, animation: false} }
                        opts={{ renderer: 'canvas' }}
                    /> }
                </Paragraph>
                <Title level={3}>Monthly Electricity Bill</Title>
                <Paragraph>
                    { this.props.electricityBill.loaded &&
                    <ReactEcharts
                        className="preserve chart"
                        option={ {...this.props.electricityBill.option, animation: false} }
                        opts={{ renderer: 'canvas' }}
                    /> }
                </Paragraph>

                <Title level={2}>PV Production</Title>
                <Paragraph>
                    { this.props.pvProduction.loaded &&
                    <ReactEcharts
                        className="preserve chart"
                        option={ {...this.props.pvProduction.option, animation: false} }
                        opts={{ renderer: 'canvas' }}
                    /> }
                </Paragraph>


                <Title level={2}>Losses</Title>
                <Paragraph>
                    { this.props.loss.loaded &&
                    <ReactEcharts
                        className="preserve chart"
                        option={ {...this.props.loss.option, animation: false} }
                        opts={{ renderer: 'canvas' }}
                    /> }
                </Paragraph>


                <Title level={2}>Weather & System Output</Title>
                <Paragraph>
                    { this.props.displayMode.mode === 'year'  && <p>Year-Level Statistics (Every Month)</p> }
                    { this.props.displayMode.mode === 'month' && <p>Month-Level Statistics (Every Day)</p> }
                    { this.props.displayMode.mode === 'day'   && <p>Day-Level Statistics (Every Hour)</p>}
                    { displayModeTable[this.props.displayMode.mode].monthSelect && <p>Month: { UtilFunctions.getMonthName(this.props.displayMode.month) }</p> }
                    { displayModeTable[this.props.displayMode.mode].daySelect && <p>Day: { this.props.displayMode.day }</p> }
                    <p>Inverter: {this.props.displayMode.inverter}</p>
                </Paragraph>

                { displayModeTable[this.props.displayMode.mode].weather &&
                <>
                    <Title level={3}>Weather</Title>
                    <Paragraph>
                        { this.props.weather.loaded &&
                        <ReactEcharts
                            className="preserve chart"
                            option={ {...this.props.weather.option, animation: false} }
                            opts={{ renderer: 'canvas' }}
                        /> }
                    </Paragraph>
                </> }

                { displayModeTable[this.props.displayMode.mode].condition &&
                <>
                    <Title level={3}>Board Working Condition</Title>
                    <Paragraph>
                        { this.props.boardWorkingConditionLeft.loaded &&
                        <ReactEcharts
                            className="preserve chart"
                            option={ {...this.props.boardWorkingConditionLeft.option, animation: false} }
                            opts={{ renderer: 'canvas' }}
                        /> }
                        { this.props.boardWorkingConditionCenter.loaded &&
                        <ReactEcharts
                            className="preserve chart"
                            option={ {...this.props.boardWorkingConditionCenter.option, animation: false} }
                            opts={{ renderer: 'canvas' }}
                        /> }
                        { this.props.boardWorkingConditionRight.loaded &&
                        <ReactEcharts
                            className="preserve chart"
                            option={ {...this.props.boardWorkingConditionRight.option, animation: false} }
                            opts={{ renderer: 'canvas' }}
                        /> }
                    </Paragraph>
                </> }

                { displayModeTable[this.props.displayMode.mode].energy &&
                <>
                    <Title level={3}>Energy</Title>
                    <Paragraph>
                        { this.props.energy.loaded &&
                        <ReactEcharts
                            className="preserve chart"
                            option={ {...this.props.energy.option, animation: false} }
                            opts={{ renderer: 'canvas' }}
                        /> }
                    </Paragraph>
                </> }

                <Title level={2}>Equipment</Title>
                <Paragraph>
                    { this.props.metadata.loaded &&
                    <Table dataSource={this.props.table} bordered={true} pagination={false} size='small' >
                        <Table.Column title="Device Type" dataIndex="device" key="device" render={text => <b>{text}</b>} />
                        <Table.Column title="Model" dataIndex="model" key="model" />
                        <Table.Column title="Quantity" dataIndex="quantity" key="quantity" />
                        <Table.Column title="Capital Cost" dataIndex="capital" key="capital" />
                    </Table> }
                </Paragraph>

            </Layout>
        )
    }
}


// pass data to props
function mapStateToProps(state) {
    let props = state.undoableReducer.present.reportManager;

    // process loading metadata
    if (state.undoableReducer.present.reportManager.metadata.loaded) {
        props = {
            ...props,
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
            icon: {
                panel: {
                    image: panel,
                    title: 'PV Installed Capacity',
                    value: state.undoableReducer.present.reportManager.metadata.option.data.PV_Installed_Capacity,
                    suffix: 'kW',
                    precision: 1,
                },
                dollar: {
                    image: dollar,
                    title: 'Project Cost',
                    value: state.undoableReducer.present.reportManager.metadata.option.data.Project_Cost,
                    suffix: 'k USD',
                    precision: 1,
                },
                factory: {
                    image: factory,
                    title: <div>CO<sub>2</sub> Emission Reduced</div>,
                    value: state.undoableReducer.present.reportManager.metadata.option.data.CO2_Reduced,
                    suffix: 'tons/year',
                    precision: 1,
                },
                house: {
                    image: house,
                    title: 'Annual PV Production',
                    value: state.undoableReducer.present.reportManager.metadata.option.data.Annual_PV_Production,
                    suffix: 'MWh',
                    precision: 1,
                },
            }
        }
    }

    return props;
}

export default connect(mapStateToProps)(PrintPreview);
