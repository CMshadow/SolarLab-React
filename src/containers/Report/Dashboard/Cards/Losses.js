import React, { Component } from 'react';
import { Card, Col } from "antd";
import { connect } from "react-redux";
import ReactEcharts from 'echarts-for-react';

class Losses extends Component {
    render () {
        return (
            <Col span={this.props.span * 6} style={{ padding: 8 }}>
                <Card
                    title={ <b>Losses</b> }
                    style={{ height: '100%', cursor: 'default' }}
                    hoverable={ true }
                    loading={ !this.props.loss.loaded }
                >
                    { this.props.loss.loaded &&
                    <ReactEcharts
                        option={ this.props.loss.option }
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
        loss: {
            loaded: state.loss.loaded,
            option: state.loss.option,
        },
    }
}

export default connect(mapStateToProps)(Losses);
