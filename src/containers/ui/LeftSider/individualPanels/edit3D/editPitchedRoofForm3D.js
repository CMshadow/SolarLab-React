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

import * as actions from '../../../../../store/actions/index';

class EditPitchedRoofForm extends PureComponent {

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

    const pointContent = (
      <p>Pick a point</p>
    )

    const ThreePoints = (
      <Form.Item>
        <Row type="flex" justify="center">
          <h4>Provide the height of three points</h4>
        </Row>
        <Row style={{'textAlign':'center'}}>
          <Col span={8}>
            <Popover content={pointContent} trigger='click'>
              <Button type="danger" shape="circle" size='small' onClick={()=>{
                this.props.showOnlyOneRoofPlane(this.props.entityId)
              }}/>
            </Popover>
          </Col>
        </Row>
      </Form.Item>
    )


    return (
      <Form onSubmit={this.handleSubmit}>
        {LowestHeight}
        {HighestHeight}
        {ThreePoints}
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
      dispatch(actions.createPolygonFoundationWrapper()),
    showOnlyOneRoofPlane: (roofId) =>
      dispatch(actions.showOnlyOneRoofPlane(roofId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'editRoof' })(EditPitchedRoofForm));
