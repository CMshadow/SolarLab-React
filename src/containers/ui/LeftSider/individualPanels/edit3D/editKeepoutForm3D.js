import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  InputNumber,
  Row,
  Col,
  Button,
} from 'antd';

import * as actions from '../../../../../store/actions/index';

class EditKeepoutForm extends PureComponent {
  state = {
    height: this.props.height ? this.props.height : 0,
    setback: this.props.setback ? this.props.setback : 0,
    width: this.props.width ? this.props.width: 0,
    radius: this.props.radius ? this.props.radius : 0,
    angle: this.props.angle ? this.props.angle : 0,
    heading: this.props.bearing ? this.props.bearing : 0,
  }

  generateTypeText = () => {
    switch (this.props.type) {
      case 'VENT':
        return 'Vent';
      case 'ENV':
        return 'Obstacle';
      case 'TREE':
        return 'Tree';
      default:
        return 'Keepout';
    }
  };

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

    const keepoutHeight = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4>{this.generateTypeText()} Height</h4>
          </Col>
          <Col span={10}>
            {getFieldDecorator('height', {
              rules: [...this.numberInputRules],
              initialValue: this.state.height
            })(
              <InputNumber
                min={0}
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

    const keepoutSetback = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4> Keepout Setback </h4>
          </Col>
          <Col span={10}>
            {getFieldDecorator('setback', {
              rules: [...this.numberInputRules],
              initialValue: this.state.setback
            })(
              <InputNumber
                min={0}
                max={5}
                step={0.1}
                formatter={value => `${value}m`}
                parser={value => value.replace('m', '')}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    );

    const passageWidth = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4> Passage Width </h4>
          </Col>
          <Col span={10}>
            {getFieldDecorator('passageWidth', {
              rules: [...this.numberInputRules],
              initialValue: this.state.width
            })(
              <InputNumber
                min={0}
                max={10}
                step={0.1}
                formatter={value => `${value}m`}
                parser={value => value.replace('m', '')}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    );

    const keepoutRadius = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4> Radius </h4>
          </Col>
          <Col span={10}>
            {getFieldDecorator('radius', {
              rules: [...this.numberInputRules],
              initialValue: this.state.radius
            })(
              <InputNumber
                min={1}
                max={50}
                step={1}
                formatter={value => `${value}m`}
                parser={value => value.replace('m', '')}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    );

    const keepoutAngle = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4> Angle </h4>
          </Col>
          <Col span={10}>
            {getFieldDecorator('angle', {
              rules: [...this.numberInputRules],
              initialValue: this.state.angle
            })(
              <InputNumber
                min={1}
                max={360}
                step={1}
                formatter={value => `${value}\xB0`}
                parser={value => value.replace('\xB0', '')}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    );

    const keepoutHeading = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4> Vent Heading </h4>
          </Col>
          <Col span={10}>
            {getFieldDecorator('heading', {
              rules: [...this.numberInputRules],
              initialValue: this.state.heading
            })(
              <InputNumber
                min={0}
                max={359}
                step={1}
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
        {
          this.props.type !== 'PASSAGE' && this.props.type !== 'VENT' ?
          keepoutHeight :
          null
        }
        {this.props.type === 'KEEPOUT' ? keepoutSetback : null}
        {this.props.type === 'PASSAGE' ? passageWidth : null}
        {this.props.type === 'VENT' ? keepoutHeading : null}
        {this.props.type === 'VENT' ? keepoutAngle : null}
        {
          this.props.type === 'VENT' || this.props.type === 'TREE' ?
          keepoutRadius :
          null
        }
      </Form>
    );
  }
};

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return {
    reRenderKeepoutPolygon: (type, id, values) =>
      dispatch(actions.reRenderKeepoutPolygon(type, id, values))
  };
};

const formOptions = {
  name: 'editKeepout',
  onValuesChange: (props, changedValues, allValues) => {
    let validation = true;
    Object.keys(allValues).forEach(k => {
      if (typeof(allValues[k]) !== 'number') validation = false
    });
    if (validation) props.reRenderKeepoutPolygon(props.type, props.id, allValues);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create(formOptions)(EditKeepoutForm));
