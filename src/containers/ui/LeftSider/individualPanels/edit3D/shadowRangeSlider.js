import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ConfigProvider,
  List,
  Card,
  Row,
  Col,
  Button,
  Slider
} from 'antd';

import * as actions from '../../../../../store/actions/index';
import * as uiStateJudge from '../../../../../infrastructure/ui/uiStateJudge';

class ShadowRangeSlider extends Component {
  slidermMarks = {
    0: '12AM',
    9: '9AM',
    16: '4PM',
    23: '11PM',
  };

  render () {
    return (
      <Slider range marks={this.slidermMarks} defaultValue={[26, 37]} />
    )
  }

}

const mapStateToProps = state => {
  return {
  };
};

export default connect(mapStateToProps)(ShadowRangeSlider);
