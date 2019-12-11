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
import { sunPosition } from '../../../../../infrastructure/math/sunPositionCalculation';

const { Option } = Select;

class ShadowControl extends Component {
  slidermMarks = {
    1: '1AM',
    9: '9AM',
    16: '4PM',
    23: '11PM',
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        const sunPositionCollection = [];
        for (let month = 1; month <= 12; month++) {
          for (let day = 1; day <= 30 ; day ++) {
            if (month === 2 && day > 28) break;
            for (let hour = values.timeRange[0]; hour <= values.timeRange[1]; hour++) {
              sunPositionCollection.push(
                sunPosition(
                  2019, month, day, hour, this.props.projectInfo.projectLon,
                  this.props.projectInfo.projectLat, values.timeZone
                )
              );
            }
          }
        }
        console.log(sunPositionCollection)
        this.props.projectAllShadow(
          this.props.normalKeepout,
          this.props.treeKeepout,
          this.props.envKeepout,
          this.props.buildingParapet,
          this.props.foundationPolygon,
          sunPositionCollection
        );
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

        {/*The button to validate & process to re-project shadow*/}
        <Row type="flex" justify="center">
          <Col span={16}>
            <Button type='primary' shape='round' size='small'
              htmlType="submit" block ghost
            >
              Project Shadow
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }

}

const mapStateToProps = state => {
  return {
    projectInfo: state.projectManagerReducer.projectInfo,
    normalKeepout:
      state.undoableReducer.present.drawingKeepoutPolygonManagerReducer
      .normalKeepout,
    treeKeepout:
      state.undoableReducer.present.drawingKeepoutPolygonManagerReducer
      .treeKeepout,
    envKeepout:
      state.undoableReducer.present.drawingKeepoutPolygonManagerReducer
      .envKeepout,
    buildingParapet:
      state.undoableReducer.present.drawingPolygonManagerReducer
      .BuildingParapet,
    foundationPolygon:
      state.undoableReducer.present.drawingPolygonManagerReducer
      .BuildingFoundation,
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'shadowSetting' })(ShadowControl));
