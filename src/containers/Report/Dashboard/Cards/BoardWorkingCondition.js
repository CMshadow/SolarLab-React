import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Col, Row } from "antd";
import ReactEcharts from 'echarts-for-react';

class BoardWorkingCondition extends Component {
    render () {
        return (
            <Col span={this.props.span * 6} style={{ padding: 8 }}>
                <Card
                    title="Board Working Condition"
                    type="inner"
                    size="small"
                    style={{ height: '100%', cursor: 'default' }}
                    hoverable={ true }
                >
                    <Row type="flex">
                        <Col span={8} style={{ paddingRight: 8 }}>
                            <Card
                                title="Array DC Current Output"
                                type="inner"
                                size="small"
                                style={{ height: '100%' }}
                                loading={ !this.props.boardWorkingConditionLeft.loaded }
                            >
                                { this.props.boardWorkingConditionLeft.loaded &&
                                <ReactEcharts
                                    option={ this.props.boardWorkingConditionLeft.option }
                                    opts={{ renderer: 'svg' }}
                                /> }
                            </Card>
                        </Col>

                        <Col span={8} style={{ paddingLeft: 8, paddingRight: 8 }}>
                            <Card
                                title="Array DC Power Output"
                                type="inner"
                                size="small"
                                style={{ height: '100%' }}
                                loading={ !this.props.boardWorkingConditionCenter.loaded }
                            >
                                { this.props.boardWorkingConditionCenter.loaded &&
                                <ReactEcharts
                                    option={ this.props.boardWorkingConditionCenter.option }
                                    opts={{ renderer: 'svg' }}
                                /> }
                            </Card>
                        </Col>

                        <Col span={8} style={{ paddingLeft: 8 }}>
                            <Card
                                title="Array DC Voltage Output"
                                type="inner"
                                size="small"
                                style={{ height: '100%' }}
                                loading={ !this.props.boardWorkingConditionRight.loaded }
                            >
                                { this.props.boardWorkingConditionRight.loaded &&
                                <ReactEcharts
                                    option={ this.props.boardWorkingConditionRight.option }
                                    opts={{ renderer: 'svg' }}
                                /> }
                            </Card>
                        </Col>
                    </Row>

                </Card>
            </Col>
        )
    }
}


// pass data to props
function mapStateToProps(state) {
    return {
        displayMode: {
            mode: state.undoable.present.reportManager.displayMode.mode,
            month: state.undoable.present.reportManager.displayMode.month,
            day: state.undoable.present.reportManager.displayMode.day,
            inverter: state.undoable.present.reportManager.displayMode.inverter,
        },
        boardWorkingConditionLeft: {
            loaded: state.undoable.present.reportManager.boardWorkingConditionLeft.loaded,
            option: state.undoable.present.reportManager.boardWorkingConditionLeft.option,
        },
        boardWorkingConditionCenter: {
            loaded: state.undoable.present.reportManager.boardWorkingConditionCenter.loaded,
            option: state.undoable.present.reportManager.boardWorkingConditionCenter.option,
        },
        boardWorkingConditionRight: {
            loaded: state.undoable.present.reportManager.boardWorkingConditionRight.loaded,
            option: state.undoable.present.reportManager.boardWorkingConditionRight.option,
        },
    }
}

export default connect(mapStateToProps)(BoardWorkingCondition);
