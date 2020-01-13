import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Card, Col, Divider, Radio, Select, Form} from "antd";
import Weather from "./Weather";
import BoardWorkingCondition from "./BoardWorkingCondition";
import Energy from "./Energy";

import UtilFunctions from "../../../../infrastructure/util/UtilFunctions";

import * as actions from '../../../../store/actions/index';

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
        this.props.reload({ ...this.props.displayMode, mode: mode.target.value });
    };

    onChangeSelectMonth = month => {
        let prevDay = this.props.displayMode.day;
        let nextDayLimit = UtilFunctions.getDayOfMonth(month);
        if (prevDay > nextDayLimit)
            this.props.reload({ ...this.props.displayMode, month: month, day: nextDayLimit });
        else
            this.props.reload({ ...this.props.displayMode, month: month });
    };

    onChangeSelectDay = day => {
        this.props.reload({ ...this.props.displayMode, day: day });
    };

    onChangeSelectInverter = inverter => {
        this.props.reload({ ...this.props.displayMode, inverter: inverter });
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
            mode: state.undoableReducer.present.reportManager.displayMode.mode,
            month: state.undoableReducer.present.reportManager.displayMode.month,
            day: state.undoableReducer.present.reportManager.displayMode.day,
            inverter: state.undoableReducer.present.reportManager.displayMode.inverter,
        },
    };

    if (state.undoableReducer.present.reportManager.metadata.loaded)
        props.metadata = {
            loaded: state.undoableReducer.present.reportManager.metadata.loaded,
            inverter_count: state.undoableReducer.present.reportManager.metadata.option.data.Inverter.Quantity,
        };
    else
        props.metadata = {
            loaded: state.undoableReducer.present.reportManager.metadata.loaded,
        };

    return props;
}
// const reload = (displayMode) => {
//     reload_weather(store, displayMode);
//     reload_energy(store, displayMode);
//     reload_board_working_condition_left(store, displayMode);
//     reload_board_working_condition_center(store, displayMode);
//     reload_board_working_condition_right(store, displayMode);
// };
const mapDispatchToProps = dispatch => {
    return {
        reload: (displayMode) => {
            dispatch(actions.reload_weather(displayMode));
            dispatch(actions.reload_energy(displayMode));
            dispatch(actions.reload_board_working_condition_left(displayMode));
            dispatch(actions.reload_board_working_condition_center(displayMode));
            dispatch(actions.reload_board_working_condition_right(displayMode));
        }

   };
};


export default connect(mapStateToProps, mapDispatchToProps)(DateStatisticSelectGroup);
