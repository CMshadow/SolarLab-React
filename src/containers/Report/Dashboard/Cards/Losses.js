import React, { Component } from 'react';
import { Card, Col, Row } from "antd";
import { connect } from "react-redux";
import ReactEcharts from 'echarts-for-react';

class Losses extends Component {
  render () {
    return (
      <Col span={12}>
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
            style={{align: 'center', textAlign: 'center'}}
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
      loaded: state.undoableReducer.present.reportManager.loss.loaded,
      option: state.undoableReducer.present.reportManager.loss.option,
    },
  }
}

export default connect(mapStateToProps)(Losses);
