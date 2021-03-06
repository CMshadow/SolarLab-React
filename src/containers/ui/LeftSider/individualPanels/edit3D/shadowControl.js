import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Select,
  Row,
  Col,
  Button,
  Slider,
  Form,
  DatePicker
} from 'antd';
import moment from 'moment';
import { injectIntl, FormattedMessage } from 'react-intl';

import * as actions from '../../../../../store/actions/index';
import { sunPosition } from '../../../../../infrastructure/math/sunPositionCalculation';

const { Option } = Select;
const { RangePicker } = DatePicker;

class ShadowControl extends Component {
  slidermMarks = {
    1: '1AM',
    9: '9AM',
    15: '3PM',
    23: '11PM',
  };

  handleSubmit = (event) => {
    const dayStep = 4;
    event.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let startDate = values.dateRange[0].clone().startOf('day');
        let lastDate = values.dateRange[1].clone().startOf('day');
        if (
          startDate.isSame(`${startDate.format('YYYY')}-1-1`) &&
          lastDate.isSame(`${lastDate.format('YYYY')}-12-31`)
        ) {
          startDate = moment(`${moment().format('YYYY')}-06-22`, 'YYYY-MM-DD');
          lastDate = moment(`${moment().format('YYYY')}-12-21`, 'YYYY-MM-DD');
        }
        const sunPositionCollection = [];

        let currDate = startDate;
        while(currDate.diff(lastDate) <= 0) {
          const dailySunPositions = []
          for (
            let hour = values.timeRange[0]; hour <= values.timeRange[1]; hour++
          ) {
            dailySunPositions.push(sunPosition(
              currDate.format('YYYY'),
              currDate.format('M'),
              currDate.format('D'),
              hour,
              this.props.projectInfo.projectLon,
              this.props.projectInfo.projectLat,
              values.timeZone
            ));
          }
          sunPositionCollection.push(dailySunPositions)
          currDate = currDate.add(dayStep, 'days')
        }
        this.props.projectAllShadow(sunPositionCollection);
      }
    });
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
      <Form onSubmit={this.handleSubmit}>
        <Row type="flex" justify="center">
          <h3><FormattedMessage id='shadow_setting' /></h3>
        </Row>
        <Form.Item>
          <Row>
            <Col span={10} offset={2}>
              <h4><FormattedMessage id='date_range' /></h4>
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={2}>
              {getFieldDecorator('dateRange', {
                initialValue: [
                  moment(`${moment().format('YYYY')}-06-22`, 'YYYY-MM-DD'),
                  moment(`${moment().format('YYYY')}-12-21`, 'YYYY-MM-DD'),
                ]
              })(
                <RangePicker
                  ranges={{
                    [this.props.intl.formatMessage({id:'solstices'})]: [
                      moment(`${moment().format('YYYY')}-06-22`, 'YYYY-MM-DD'),
                      moment(`${moment().format('YYYY')}-12-21`, 'YYYY-MM-DD'),
                    ],
                    [this.props.intl.formatMessage({id:'annual'})]: [
                      moment().startOf('year'), moment().endOf('year')
                    ],
                    [this.props.intl.formatMessage({id:'winter_solstice'})]: [
                      moment(`${moment().format('YYYY')}-12-21`, 'YYYY-MM-DD'),
                      moment(`${moment().format('YYYY')}-12-21`, 'YYYY-MM-DD'),
                    ],
                  }}
                  format="YYYY/MM/DD"
                />
              )}
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Row>
            <Col span={8} offset={2}>
              <h4><FormattedMessage id='time_zone' /></h4>
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
              <h4><FormattedMessage id='time_range' /></h4>
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={2}>
              {getFieldDecorator('timeRange', {
                initialValue: [9, 15]
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

        {/*The button to validate & process to re-project shadow*/}
        <Row type="flex" justify="center">
          <Col span={12}>
            <Button type='primary' shape='round' htmlType="submit" block ghost
              loading={this.props.backendLoading}
            >
              <FormattedMessage id='project_shadow' />
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }

}

const mapStateToProps = state => {
  return {
    projectInfo:
      state.undoable.present.projectManager.projectInfo,
    backendLoading:
      state.undoable.present.projectManager.backendLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    projectAllShadow:
      (normal, tree, env, wall, foundationPolygon, sunPositionCollection) =>
      dispatch(actions.projectAllShadow(
        normal, tree, env, wall, foundationPolygon, sunPositionCollection
      ))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Form.create({ name: 'shadowSetting' })(ShadowControl)));
