import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Select,
  Row,
  Col,
  Button,
  Slider,
  Form
} from 'antd';

import * as actions from '../../../../../store/actions/index';
import * as uiStateJudge from '../../../../../infrastructure/ui/uiStateJudge';

const { Option } = Select;

class ShadowRangeSlider extends Component {
  slidermMarks = {
    1: '1AM',
    9: '9AM',
    16: '4PM',
    23: '11PM',
  };

  render () {
    const { getFieldDecorator } = this.props.form;

    const timeZonesOptions = [];
    for (let t = -11; t <= 12; t++) {
      timeZonesOptions.push(
        <Option value={t} key={t}>
          {`${t > 0 ? '+' : t < 0 ? '-' : ''}${Math.abs(t)}`}
        </Option>
      );
    }

    return (
      <Form>
        <Form.Item>
          <Row>
            <Col span={8} offset={2}>
              <h4> Time Zone </h4>
            </Col>
            <Col span={12}>
              {getFieldDecorator('timeZone', {
                initialValue: this.props.projectInfo.determineTimeZone()
              })(
                <Select style={{ width: 100 }}>
                  {timeZonesOptions}
                </Select>
              )}
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Row>
            <Col span={10} offset={2}>
              <h4>Shadow Range</h4>
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={2}>
              {getFieldDecorator('timeRange', {
                initialValue: [9, 16]
              })(
                <Slider
                  range
                  marks={this.slidermMarks}
                  max={23}
                  min={1}
                  tipFormatter={val => {
                    if (val < 12) return(`${val}AM`);
                    if (val === 12) return(`${val}PM`);
                    else return(`${val-12}PM`)
                  }}
                />
              )}
            </Col>
          </Row>
        </Form.Item>
      </Form>
    )
  }

}

const mapStateToProps = state => {
  return {
    projectInfo: state.projectManagerReducer.projectInfo
  };
};

export default connect(mapStateToProps)(Form.create({ name: 'shadowSetting' })(ShadowRangeSlider));
