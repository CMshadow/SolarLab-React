import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Input,
  InputNumber,
  Divider,
  Tooltip,
  Select,
  Row,
  Col,
  Button,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';

import * as actions from '../../../../../store/actions/index';

const { Option } = Select;

class CreateKeepoutForm extends PureComponent {
  state = {
    type: 'KEEPOUT'
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.createKeepout(values);
        this.props.toggoleInitialForm();
      }
    });
  };

  generateTypeText = () => {
    switch (this.state.type) {
      case 'TREE':
        return <FormattedMessage id='naerbyTree' />;
      case 'VENT':
        return <FormattedMessage id='rooftopVent' />;
      case 'ENV':
        return <FormattedMessage id='EnvirKeepout' />;
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
  rowLayout = {label: {span: 12, offset: 2}, field: {span: 8}};

  render () {
    const { getFieldDecorator } = this.props.form;

    const keepoutHeight = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4> {this.generateTypeText()}<FormattedMessage id='Keepout_height' /></h4>
          </Col>
          <Col span={10}>
            {getFieldDecorator('height', {
              rules: [...this.numberInputRules],
              initialValue: 1
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
              initialValue: 1
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
              initialValue: 1
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
              initialValue: 2
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
              initialValue: 120
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
            <h4><FormattedMessage id='vent_heading' /> </h4>
          </Col>
          <Col span={10}>
            {getFieldDecorator('heading', {
              rules: [...this.numberInputRules],
              initialValue: 0
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
        {/*Keepout type Select*/}
        <Form.Item>
          <Row>
            <Col span={12} offset={1}>
              <h4> <FormattedMessage id='keepOutType' /></h4>
            </Col>
            <Col span={10}>
              {getFieldDecorator('type', {
                initialValue: this.state.type
              })(
                <Select
                  onChange={(value,option) => {
                    this.setState({type:value});
                  }}>
                  <Option value='KEEPOUT'><FormattedMessage id='rooftopKeepout' /></Option>
                  <Option value='PASSAGE'><FormattedMessage id='rooftopPassage' /></Option>
                  <Option value='VENT'><FormattedMessage id='rooftopVent' /></Option>
                  <Option value='TREE'><FormattedMessage id='naerbyTree' /></Option>
                  <Option value='ENV' title='Environmental Obstacle'>
                    <FormattedMessage id='EnvirKeepout' />
                  </Option>
                </Select>
              )}
            </Col>
          </Row>
        </Form.Item>

        {
          this.state.type !== 'PASSAGE' && this.state.type !== 'VENT' ?
          keepoutHeight :
          null
        }
        {this.state.type === 'KEEPOUT' ? keepoutSetback : null}
        {this.state.type === 'PASSAGE' ? passageWidth : null}
        {this.state.type === 'VENT' ? keepoutHeading : null}
        {this.state.type === 'VENT' ? keepoutAngle : null}
        {
          this.state.type === 'VENT' || this.state.type === 'TREE' ?
          keepoutRadius :
          null
        }

        {/*The button to validate & process to create a new building*/}
        <Row type="flex" justify="center">
          <Col span={16}>
            <Button type='primary' shape='round' htmlType="submit" block>
              <FormattedMessage id='create_keepout_button' />
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
    createKeepout: (values) => dispatch(actions.createKeepout(values))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'createKeepout' })(CreateKeepoutForm));
