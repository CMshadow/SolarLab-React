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

import * as actions from '../../../../../store/actions/index';

class EditKeepoutForm extends PureComponent {
  state = {
    height: this.props.height ? this.props.height : 0,
    setback: this.props.setback ? this.props.setback : 0,
    width: this.props.width ? this.props.width: 0,
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
      case 'TREE':
        return 'Tree';
      case 'VENT':
        return 'Vent';
      case 'ENV':
        return 'Obstacle';
      default:
        return 'Keepout';
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
          <Col span={12} offset={2}>
            <h4> {this.generateTypeText()} Height </h4>
          </Col>
          <Col span={8}>
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
          <Col span={12} offset={2}>
            <h4> Keepout Setback </h4>
          </Col>
          <Col span={8}>
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
          <Col span={12} offset={2}>
            <h4> Passage Width </h4>
          </Col>
          <Col span={8}>
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

    return (
      <Form onSubmit={this.handleSubmit}>
        {this.props.type !== 'PASSAGE' ? keepoutHeight : null}
        {
          this.props.type === 'KEEPOUT' || this.props.type === 'VENT' ?
          keepoutSetback : null
        }
        {this.props.type === 'PASSAGE' ? passageWidth : null}

        {/*The button to validate & process to create a new building*/}
        <Row type="flex" justify="center">
          <Col span={16}>
            <Button type='default' shape='round' htmlType="submit" block>
              Update
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
