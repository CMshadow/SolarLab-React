import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Input,
  InputNumber,
  Divider,
  Tooltip,
  Icon,
  Select,
  Row,
  Col,
  Button,
  Radio
} from 'antd';

import * as actions from '../../../../../store/actions/index';

const { Option } = Select;

class CreateKeepoutForm extends PureComponent {
  state = {
    type: null
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('create a keepout')
      }
    });
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
            <h4> Keepout Height </h4>
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

    const passageWidth = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4> Passage Width </h4>
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
    )

    return (
      <Form onSubmit={this.handleSubmit}>
        {/*Keepout type Select*/}
        <Form.Item>
          <Row>
            <Col span={12} offset={1}>
              <h4> Keepout Type </h4>
            </Col>
            <Col span={10}>
              {getFieldDecorator('type', {
                initialValue: 'KEEPOUT'
              })(
                <Select
                  onChange={(value,option) => {
                    this.setState({type:value});
                  }}>
                  <Option value='KEEPOUT'>Keepout</Option>
                  <Option value='PASSAGE'>Passage</Option>
                  <Option value='VENT'>Vent</Option>
                  <Option value='TREE'>Tree</Option>
                  <Option value='ENV'>Environmental</Option>
                </Select>
              )}
            </Col>
          </Row>
        </Form.Item>

        {this.state.type !== 'PASSAGE' ? keepoutHeight : null}
        {this.state.type === 'PASSAGE' ? passageWidth : null}

        {/*The button to validate & process to create a new building*/}
        <Row type="flex" justify="center">
          <Col span={16}>
            <Button type='primary' shape='round' htmlType="submit" block>
              Create Keepout
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'createKeepout' })(CreateKeepoutForm));
