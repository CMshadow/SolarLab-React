import React, { Component } from 'react';
import { Card, Col } from "antd";
import { connect } from "react-redux";
import ReactEcharts from 'echarts-for-react';

class Weather extends Component {
    render () {
        return (
            <Col span={this.props.span * 6} style={{ padding: 8 }}>
                <Card
                    title="Weather"
                    type="inner"
                    size="small"
                    style={{ height: '100%', cursor: 'default' }}
                    hoverable={ true }
                    loading={ !this.props.weather.loaded }
                >
                    { this.props.weather.loaded &&
                    <ReactEcharts
                        option={ this.props.weather.option }
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
        weather: {
            loaded: state.weather.loaded,
            option: state.weather.option,
        },
    }
}

export default connect(mapStateToProps)(Weather);
