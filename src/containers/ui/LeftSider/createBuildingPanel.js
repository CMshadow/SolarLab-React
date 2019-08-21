import React, {Component} from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Input,
  InputNumber,
  Divider,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
} from 'antd';

import * as classes from './createBuildingPanel.module.css';
import * as actions from '../../../store/actions/index';

const { Option } = Select;

class CreateBuildingPanel extends Component {

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.setUIStateReadyDrawing();
        this.props.initBuilding(values);
      }
    });
  };

  numberInputRules = [{
    type: 'number',
    message: 'Please provide a valid number'
  },{
    required: true,
    message: 'Cannot be empty'
  }]


  render () {
    const { getFieldDecorator } = this.props.form;

    let optionalParapetHtInput = (
      <Form.Item>
        <Row>
          <Col span={12}>
            <Tooltip
              placement="topLeft"
              title="The height of parapet beyond the rooftop"
            >
              <Row>
                <Col span={20}>
                  <h4>Parapet Height</h4>
                </Col>
                <Col span={4}>
                  <Icon type="question-circle" />
                </Col>
              </Row>
            </Tooltip>
          </Col>
          <Col span={12}>
            {getFieldDecorator('parapetHt', {
              rules: [...this.numberInputRules],
              initialValue: 1
            })(
              <InputNumber
                className={classes.inputArea}
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
    let optionalHipStbInput = null;
    let optionalRidgeStbInput = null;
    if (this.props.form.getFieldValue('type') === 'PITCHED') {
      optionalParapetHtInput = null;
      optionalHipStbInput = (
        <Form.Item>
        <Row>
          <Col span={12}>
            <Tooltip
              placement="topLeft"
              title="The setback distance from hips towards fields of the roof"
            >
              <Row>
                <Col span={20}>
                  <h4>Hip Setback</h4>
                </Col>
                <Col span={4}>
                  <Icon type="question-circle" />
                </Col>
              </Row>
            </Tooltip>
          </Col>
          <Col span={12}>
            {getFieldDecorator('hipStb', {
              rules: [...this.numberInputRules],
              initialValue: 1
            })(
              <InputNumber
                className={classes.inputArea}
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
      optionalRidgeStbInput = (
        <Form.Item>
          <Row>
            <Col span={12}>
              <Tooltip
                placement="topLeft"
                title="The setback distance from ridges towards fields of the roof"
              >
                <Row>
                  <Col span={20}>
                    <h4>Ridge Setback</h4>
                  </Col>
                  <Col span={4}>
                    <Icon type="question-circle" />
                  </Col>
                </Row>
              </Tooltip>
            </Col>
            <Col span={12}>
              {getFieldDecorator('ridgeStb', {
                rules: [...this.numberInputRules],
                initialValue: 1
              })(
                <InputNumber
                  className={classes.inputArea}
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
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        {/*Bulding name Input*/}
        <Form.Item>
          <h3> Building Name </h3>
            {getFieldDecorator('buildingName', {
              rules: [{
                required: true,
                message: 'Please provide a building name'
              }],})(
                <Input
                  placeholder='Your building name'
                  allowClear
                  autoComplete="off"/>
              )
            }
        </Form.Item>

        {/*Bulding type Select*/}
        <Form.Item>
          <Row>
            <Col span={12}>
              <h4> Building Type </h4>
            </Col>
            <Col span={12}>
              {getFieldDecorator('type', {
                initialValue: 'FLAT'
              })(
                <Select className={classes.inputArea}>
                  <Option value='FLAT'>Flat Roof</Option>
                  <Option value='PITCHED'>Pitched Roof</Option>
                </Select>
              )}
            </Col>
          </Row>
        </Form.Item>

        {/*All heights input go to here*/}
        <Divider />
        <Form.Item>
          <Row>
            <Col span={12}>
              <Tooltip
                placement="topLeft"
                title="The height of the building foundation"
              >
                <Row>
                  <Col span={20}>
                    <h4>Building Height</h4>
                  </Col>
                  <Col span={4}>
                    <Icon type="question-circle" />
                  </Col>
                </Row>
              </Tooltip>
            </Col>
            <Col span={12}>
              {getFieldDecorator('foundHt', {
                rules: [...this.numberInputRules],
                initialValue: 5
              })(
                <InputNumber
                  className={classes.inputArea}
                  min={0}
                  max={500}
                  step={0.1}
                  formatter={value => `${value}m`}
                  parser={value => value.replace('m', '')}
                />
              )}
            </Col>
          </Row>
        </Form.Item>
        {optionalParapetHtInput}

        {/*All setbacks inputs go to here*/}
        <Divider />
        <Form.Item>
          <Row>
            <Col span={12}>
              <Tooltip
                placement="topLeft"
                title="The setback distance from eaves towards building inside"
              >
                <Row>
                  <Col span={20}>
                    <h4>Eave Setback</h4>
                  </Col>
                  <Col span={4}>
                    <Icon type="question-circle" />
                  </Col>
                </Row>
              </Tooltip>
            </Col>
            <Col span={12}>
              {getFieldDecorator('eaveStb', {
                rules: [...this.numberInputRules],
                initialValue: 1
              })(
                <InputNumber
                  className={classes.inputArea}
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
        {optionalHipStbInput}
        {optionalRidgeStbInput}

        {/*The button to validate & process to create a new building*/}
        <Row>
          <Col span={16} offset={2}>
            <Button type='primary' shape='round' icon='plus' size='large'
              htmlType="submit"
            >
              Create a Building
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setUIStateReadyDrawing: () => dispatch(actions.setUIStateReadyDrawing()),
    initBuilding: (values) => dispatch(actions.initBuilding(values))
  };
};

export default connect(null, mapDispatchToProps)(Form.create({ name: 'createBuilding' })(CreateBuildingPanel));
