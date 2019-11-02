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

class EditRoofForm extends PureComponent {

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.updateBuilding(values);
        this.props.createPolygonFoundationWrapper();
        this.props.toggleEdit();
      }
    });
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

    const foundationHeight = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4>Roof Height</h4>
          </Col>
          <Col span={10}>
            {getFieldDecorator('foundationHeight', {
              rules: [...this.numberInputRules],
              initialValue: this.props.workingBuilding.foundationHeight
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

    const eaveSetback = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4> Eave Setback </h4>
          </Col>
          <Col span={10}>
            {getFieldDecorator('eaveStb', {
              rules: [...this.numberInputRules],
              initialValue: this.props.workingBuilding.eaveSetback
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

    const parapetHeight = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4> Parapet Height </h4>
          </Col>
          <Col span={10}>
            {getFieldDecorator('parapetHeight', {
              rules: [...this.numberInputRules],
              initialValue: this.props.workingBuilding.parapetHeight
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

    return (
      <Form onSubmit={this.handleSubmit}>
        {foundationHeight}
        {eaveSetback}
        {this.props.workingBuilding.type === 'FLAT' ? parapetHeight: null}
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
    workingBuilding: state.buildingManagerReducer.workingBuilding
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateBuilding: (values) =>
      dispatch(actions.updateBuilding(values)),
    createPolygonFoundationWrapper: () =>
      dispatch(actions.createPolygonFoundationWrapper())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'editRoof' })(EditRoofForm));
