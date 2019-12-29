import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  InputNumber,
  Row,
  Col,
  Button,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';

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

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.updateKeepout(this.props.id, values);
        this.props.toggleEdit();
      }
    });
  };

  generateTypeText = () => {
    switch (this.props.type) {
      case 'VENT':
        return <FormattedMessage id='rooftopVent' />;
      case 'ENV':
        return <FormattedMessage id='EnvirKeepout' />;
      case 'TREE':
        return <FormattedMessage id='naerbyTree' />;
      default:
        return <FormattedMessage id='rooftopKeepout' />;
    }
  };

  numberInputRules = [{
    type: 'number',
    message: 'Please provide a valid number'
  },{
    required: true,
    message: 'Cannot be empty'
  }];

  render () {
    const { getFieldDecorator } = this.props.form;

    const keepoutHeight = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4>{this.generateTypeText()}<FormattedMessage id='Keepout_height' /></h4>
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
            <h4> <FormattedMessage id='keepout_setback' /> </h4>
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
            <h4> <FormattedMessage id='passage_width' /> </h4>
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
            <h4> <FormattedMessage id='vent_radius' /> </h4>
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
            <h4> <FormattedMessage id='vent_angle' /> </h4>
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
            <h4> <FormattedMessage id='vent_heading' /> </h4>
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
      <Form onSubmit={this.handleSubmit}>
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

        {/*The button to validate & process to create a new building*/}
        <Row type="flex" justify="center">
          <Col span={16}>
            <Button type='default' shape='round' htmlType="submit" block>
              <FormattedMessage id='update_keepout_button' />
            </Button>
          </Col>
        </Row>
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
    updateKeepout: (id, values) => dispatch(actions.updateKeepout(id,values))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'editKeepout' })(EditKeepoutForm));
