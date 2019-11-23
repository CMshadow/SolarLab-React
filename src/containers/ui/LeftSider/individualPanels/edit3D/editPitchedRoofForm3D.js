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

class EditPitchedRoofForm extends PureComponent {

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

    const HighestHeight = (
      <Form.Item>
        <Row>
          <Col span={12} offset={1}>
            <h4>Lowest Height</h4>
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

    return (
      <Form>
        {LowestHeight}
        {HighestHeight}
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
      dispatch(actions.updateSingleRoofTop(rooftopIndex, lowest, highest))
  };
};

const formOptions = {
  name: 'editRoof',
  onValuesChange: (props, changedValues, allValues) => {
    if (
      typeof(allValues.lowestHeight) === 'number' &&
      typeof(allValues.highestHeight) === 'number' &&
      allValues.lowestHeight < allValues.highestHeight
    ) {
      props.updateRoofTop(
        props.roofIndex, allValues.lowestHeight, allValues.highestHeight
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create(formOptions)(EditPitchedRoofForm));
