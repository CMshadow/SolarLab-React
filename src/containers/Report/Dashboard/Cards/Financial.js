import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Col, Row } from "antd";
import ReactEcharts from 'echarts-for-react';

class Financial extends Component {
  render () {
    return (
      <Col span={24}>
        <Card
          title={ <b>Finance</b> }
          style={{ height: '100%', cursor: 'default' }}
          hoverable={ true }
        >
          <Row type="flex" justify='center' gutter={[8, 8]}>
            <Col span={12} style={{ textAlign: 'center' }}>
              <Card
                title="Project Cash Flow"
                type="inner"
                size="small"
                style={{ height: '100%', cursor: 'default' }}
                loading={ !this.props.cashFlow.loaded }
              >
                { this.props.cashFlow.loaded &&
                <ReactEcharts
                  option={ this.props.cashFlow.option }
                  opts={{ renderer: 'svg' }}
                /> }
              </Card>
            </Col>

            <Col span={12}>
              <Card
                title="Monthly Electricity Bill"
                type="inner"
                size="small"
                style={{ height: '100%' }}
                loading={ !this.props.electricityBill.loaded }
              >
                { this.props.electricityBill.loaded &&
                <ReactEcharts
                  option={ this.props.electricityBill.option }
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
    cashFlow: {
      loaded: state.undoableReducer.present.reportManager.cashFlow.loaded,
      option: state.undoableReducer.present.reportManager.cashFlow.option,
    },
    electricityBill: {
      loaded: state.undoableReducer.present.reportManager.electricityBill.loaded,
      option: state.undoableReducer.present.reportManager.electricityBill.option,
    },
  }
}

export default connect(mapStateToProps)(Financial);
