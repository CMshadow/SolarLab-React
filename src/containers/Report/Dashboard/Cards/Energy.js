import React, { Component } from 'react';
import { Card, Col } from "antd";
import { connect } from "react-redux";
import ReactEcharts from 'echarts-for-react';

class Energy extends Component {
    render () {
        return (
            <Col span={this.props.span * 6} style={{ padding: 8 }}>
                <Card
                    title="Energy"
                    type="inner"
                    size="small"
                    style={{ height: '100%', cursor: 'default' }}
                    hoverable={ true }
                    loading={ !this.props.energy.loaded }
                >
                    { this.props.energy.loaded &&
                    <ReactEcharts
                        option={ this.props.energy.option }
                        opts={{ renderer: 'svg' }}
                    /> }
                </Card>
            </Col>
        )
    }
}


// pass data to props
function mapStateToProps(state) {
    return {
        energy: {
            loaded: state.undoableReducer.present.reportManager.energy.loaded,
            option: state.undoableReducer.present.reportManager.energy.option,
        },
    }
}

export default connect(mapStateToProps)(Energy);
