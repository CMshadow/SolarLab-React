import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  InputNumber,
  Row,
  Col,
  Button,
  Popover
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';

import * as actions from '../../../../../store/actions/index';

class EditRoofForm extends PureComponent {

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
            <h4><FormattedMessage id='buildingHeight' /></h4>
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
            <h4> <FormattedMessage id='eaveSetback' /> </h4>
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
            <h4> <FormattedMessage id='parapetHeight' /> </h4>
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
      <Form>
        {foundationHeight}
        {eaveSetback}
        {this.props.workingBuilding.type === 'FLAT' ? parapetHeight: null}
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

const formOptions = {
  name: 'editRoof',
  onValuesChange: (props, changedValues, allValues) => {
    let valueValid = true;
    Object.keys(allValues).forEach(k => {
      if (typeof(allValues[k]) !== 'number') valueValid = false
    });
    if (valueValid) {
      props.updateBuilding(allValues);
      props.createPolygonFoundationWrapper();
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create(formOptions)(EditRoofForm));
