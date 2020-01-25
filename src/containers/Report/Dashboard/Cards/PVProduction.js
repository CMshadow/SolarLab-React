import React, { Component } from 'react';
import { Card, Col } from "antd";
import { connect } from "react-redux";
import ReactEcharts from 'echarts-for-react';

class PVProduction extends Component {
  render () {
    return (
      <Col span={this.props.span * 6} style={{ padding: 8 }}>
        <Card
          title={ <b>PV Production</b> }
          style={{ height: '100%', cursor: 'default' }}
          hoverable={ true }
          loading={ !this.props.pvProduction.loaded }
        >
          { this.props.pvProduction.loaded &&
          <ReactEcharts
            option={ this.props.pvProduction.option }
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
    pvProduction: {
      loaded: state.undoable.present.reportManager.pvProduction.loaded,
      option: state.undoable.present.reportManager.pvProduction.option,
    },
  }
}

export default connect(mapStateToProps)(PVProduction);
