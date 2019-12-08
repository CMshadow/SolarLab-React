import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  InputNumber,
  Row,
  Col,
  Button,
  Radio
} from 'antd';

import * as actions from '../../../../../store/actions/index';

class EditPitchedRoofForm extends PureComponent {
  state = {
    calculateMode: 'height'
  }

  numberInputRules = [
    {
      type: 'number',
      message: 'Please provide a valid number'
    },{
      required: true,
      message: 'Cannot be empty'
    }
  ];

  render () {
    const { getFieldDecorator } = this.props.form;

    const LowestHeight = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4>Lowest Height</h4>
          </Col>
          <Col span={10}>
            {getFieldDecorator('lowestHeight', {
              rules: [...this.numberInputRules],
              initialValue: this.props.lowestNode[2]
            })(
              <InputNumber
                min={0}
                max={this.props.highestNode[2]}
                step={0.1}
                formatter={value => `${value}m`}
                parser={value => value.replace('m', '')}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    );

    const HeightOrAngle = (
        <Row>
          <Col span={22} offset={1} style={{textAlign: 'center'}}>
            {getFieldDecorator('heightOrAngle', {
              initialValue: this.state.calculateMode
            })(
              <Radio.Group
                onChange={(e) => {
                  this.setState({calculateMode: e.target.value})
                }}
              >
                <Radio.Button value="height" defaultChecked>
                  Height
                </Radio.Button>
                <Radio.Button value="angle">
                  Angle
                </Radio.Button>
              </Radio.Group>
            )}
          </Col>
        </Row>
    )

    const HighestHeight = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4>Highest Height</h4>
          </Col>
          <Col span={10}>
            {getFieldDecorator('highestHeight', {
              rules: [...this.numberInputRules],
              initialValue: this.props.highestNode[2]
            })(
              <InputNumber
                min={this.props.lowestNode[2]}
                max={100}
                step={0.1}
                formatter={value => `${value}m`}
                parser={value => value.replace('m', '')}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    );

    const PitchedAngle = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4>Pitched Angle</h4>
          </Col>
          <Col span={10}>
            {getFieldDecorator('pitchedAngle', {
              rules: [...this.numberInputRules],
              initialValue: this.props.obliquity
            })(
              <InputNumber
                min={0}
                max={90}
                step={0.1}
                formatter={value => `${value}\xB0`}
                parser={value => value.replace('\xB0', '')}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    );

    return (
      <Form>
        {LowestHeight}
        {HeightOrAngle}
        {this.state.calculateMode === 'height' ? HighestHeight : PitchedAngle}
      </Form>
    );
  }
};

const mapStateToProps = state => {
  return {
    workingBuilding: state.buildingManagerReducer.workingBuilding
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateBuilding: (values) =>
      dispatch(actions.updateBuilding(values)),
    createPolygonFoundationWrapper: () =>
      dispatch(actions.createPolygonFoundationWrapper()),
    updateRoofTop: (rooftopIndex, lowest, highest) =>
      dispatch(actions.updateSingleRoofTop(rooftopIndex, lowest, highest)),
    updateKeepoutOnRoof: (rooftopIndex) =>
      dispatch(actions.updateKeepoutOnRoof(rooftopIndex))
  };
};

const formOptions = {
  name: 'editRoof',
  onValuesChange: (props, changedValues, allValues) => {
    let valueValid = true
    Object.keys(allValues).forEach(k => {
      if (typeof(allValues[k]) !== 'number' && k !== 'heightOrAngle') {
        valueValid = false
      }
    })
    if (valueValid && Object.keys(changedValues)[0] !== 'heightOrAngle') {
      console.log(allValues)
      if (allValues.heightOrAngle === 'height' &&
      allValues.lowestHeight <= allValues.highestHeight) {
        props.updateRoofTop(
          props.roofIndex, allValues.lowestHeight, allValues.highestHeight
        );
        props.updateKeepoutOnRoof(props.roofIndex);
      }
      else if (allValues.heightOrAngle === 'angle') {
        console.log(props.obliquity)
        const tan = Math.tan(props.obliquity * Math.PI/180);
        const adjuentLen = (props.highestNode[2] - props.lowestNode[2]) / tan;
        const newTan = Math.tan(allValues.pitchedAngle * Math.PI/180);
        const newHeight = adjuentLen * newTan;
        const newHighestHeight = newHeight + props.lowestNode[2];
        props.updateRoofTop(
          props.roofIndex, allValues.lowestHeight, newHighestHeight
        );
        props.updateKeepoutOnRoof(props.roofIndex);
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create(formOptions)(EditPitchedRoofForm));
