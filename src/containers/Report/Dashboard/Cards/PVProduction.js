import React, { Component } from 'react';
import { Card, Col, Row } from "antd";
import { connect } from "react-redux";
import ReactEcharts from 'echarts-for-react';

class PVProduction extends Component {
  render () {
    return (
      <Col span={12}>
        <Card
          title={ <b>PV Production</b> }
          style={{ height: '100%', cursor: 'default' }}
          hoverable={ true }
          loading={ !this.props.pvProduction.loaded }
        >
          { this.props.pvProduction.loaded &&
          <ReactEcharts
            option={ this.props.pvProduction.option }
            style={{ align: 'center', textAlign: 'center',
              marginLeft:'auto', marginRight:'auto', display:'block'
            }}
          /> }
        </Card>
      </Col>
    )
  }
}


// pass data to props
function mapStateToProps(state) {
  return {
    pvProduction: {
      loaded: state.undoableReducer.present.reportManager.pvProduction.loaded,
      option: state.undoableReducer.present.reportManager.pvProduction.option,
    },
  }
}

export default connect(mapStateToProps)(PVProduction);
