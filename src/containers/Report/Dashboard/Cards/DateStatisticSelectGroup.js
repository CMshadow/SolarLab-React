import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Card, Col, Divider, Radio, Select, Form} from "antd";
import Weather from "./Weather";
import BoardWorkingCondition from "./BoardWorkingCondition";
import Energy from "./Energy";

import UtilFunctions from "../../request_functions/UtilFunctions";
import store from "../../store";

import { reload_weather } from "../../request_functions/request_weather";
import { reload_energy } from "../../request_functions/request_energy";
import { reload_board_working_condition_left } from "../../request_functions/request_board_working_condition_left";
import { reload_board_working_condition_center } from "../../request_functions/request_board_working_condition_center";
import { reload_board_working_condition_right } from "../../request_functions/request_board_working_condition_right";

const reload = (displayMode) => {
    reload_weather(store, displayMode);
    reload_energy(store, displayMode);
    reload_board_working_condition_left(store, displayMode);
    reload_board_working_condition_center(store, displayMode);
    reload_board_working_condition_right(store, displayMode);
};

// generate month select group
const monthGroup = [];
for (let month = 1; month <= 12; ++month)
    monthGroup.push({value: month, inner: UtilFunctions.getMonthName(month) + ' / ' + month});

// generate day select group
const dayGroup = {};
for (let month = 1; month <= 12; ++month) {
    let days = UtilFunctions.getDayOfMonth(month);
    dayGroup[month] = [...Array(days)].map((v, k) => ({value: k + 1, inner: k + 1}))
}


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

// generate inverter select group, generate when props of metadata update
const inverterGroup = [];

class DateStatisticSelectGroup extends Component {
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.metadata.loaded !== prevProps.metadata.loaded) {
            // generate inverter select group
            inverterGroup.length = 0;
            if (this.props.metadata.loaded) {
                let inverterCount = this.props.metadata.inverter_count;
                for (let i = 1; i <= inverterCount; ++i) {
                    inverterGroup.push({value: i, inner: i});
                }
            }
        }
    }

    onChangeRadio = mode => {
        reload({ ...this.props.displayMode, mode: mode.target.value });
    };

    onChangeSelectMonth = month => {
        let prevDay = this.props.displayMode.day;
        let nextDayLimit = UtilFunctions.getDayOfMonth(month);
        if (prevDay > nextDayLimit)
            reload({ ...this.props.displayMode, month: month, day: nextDayLimit });
        else
            reload({ ...this.props.displayMode, month: month });
    };

    onChangeSelectDay = day => {
        reload({ ...this.props.displayMode, day: day });
    };

    onChangeSelectInverter = inverter => {
        reload({ ...this.props.displayMode, inverter: inverter });
    };

    render () {
        return (
            <Col span={this.props.span * 6} style={{ padding: 8 }}>
                <Card
                    title={ <b>Weather & System Output</b> }
                    style={{ height: '100%', cursor: 'default' }}
                    hoverable={ true }
                >

                    <Radio.Group onChange={this.onChangeRadio} value={this.props.displayMode.mode}>
                        <Radio value={"year"} >Year-Level Statistics (Every Month)</Radio>
                        <Radio value={"month"}>Month-Level Statistics (Every Day)</Radio>
                        <Radio value={"day"}  >Day-Level Statistics (Every Hour)</Radio>
                    </Radio.Group>

                    <Divider />

                    <Form layout="inline">
                        <Form.Item label="Inverter: ">
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Select an Inverter"
                                onChange={this.onChangeSelectInverter}
                                value={this.props.displayMode.inverter}
                            >
                                {inverterGroup.map((inverter) =>
                                    <Select.Option key={inverter.value} value={inverter.value}>{inverter.inner}</Select.Option>
                                )}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Month: ">
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Select a Month"
                                onChange={this.onChangeSelectMonth}
                                value={this.props.displayMode.month}
                                disabled={!displayModeTable[this.props.displayMode.mode].monthSelect}
                            >
                                {monthGroup.map((month) =>
                                    <Select.Option key={month.value} value={month.value}>{month.inner}</Select.Option>
                                )}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Day: ">
                            <Select
                                showSearch
                                style={{width: 200}}
                                placeholder="Select a Day of Month"
                                onChange={this.onChangeSelectDay}
                                value={this.props.displayMode.day}
                                disabled={!displayModeTable[this.props.displayMode.mode].daySelect}
                            >
                                {dayGroup[this.props.displayMode.month].map((day) =>
                                    <Select.Option key={day.value} value={day.value}>{day.inner}</Select.Option>
                                )}
                            </Select>
                        </Form.Item>
                    </Form>

                    <Divider />

                    {displayModeTable[this.props.displayMode.mode].weather && <Weather span={4}/> }
                    {displayModeTable[this.props.displayMode.mode].condition && <BoardWorkingCondition span={4} /> }
                    {displayModeTable[this.props.displayMode.mode].energy && <Energy span={4} /> }

                </Card>
            </Col>
        )
    }
}


// pass data to props
function mapStateToProps(state) {
    let props = {
        displayMode: {
            mode: state.displayMode.mode,
            month: state.displayMode.month,
            day: state.displayMode.day,
            inverter: state.displayMode.inverter,
        },
    };

    if (state.metadata.loaded)
        props.metadata = {
            loaded: state.metadata.loaded,
            inverter_count: state.metadata.option.data.Inverter.Quantity,
        };
    else
        props.metadata = {
            loaded: state.metadata.loaded,
        };

    return props;
}

export default connect(mapStateToProps)(DateStatisticSelectGroup);
