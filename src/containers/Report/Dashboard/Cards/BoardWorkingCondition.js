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
            mode: state.displayMode.mode,
            month: state.displayMode.month,
            day: state.displayMode.day,
            inverter: state.displayMode.inverter,
        },
        boardWorkingConditionLeft: {
            loaded: state.boardWorkingConditionLeft.loaded,
            option: state.boardWorkingConditionLeft.option,
        },
        boardWorkingConditionCenter: {
            loaded: state.boardWorkingConditionCenter.loaded,
            option: state.boardWorkingConditionCenter.option,
        },
        boardWorkingConditionRight: {
            loaded: state.boardWorkingConditionRight.loaded,
            option: state.boardWorkingConditionRight.option,
        },
    }
}

export default connect(mapStateToProps)(BoardWorkingCondition);
