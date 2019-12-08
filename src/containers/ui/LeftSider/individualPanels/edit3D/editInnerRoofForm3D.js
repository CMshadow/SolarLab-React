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

class EditInnerRoofForm extends PureComponent {

  numberInputRules = [
    {
      type: 'number',
      message: 'Please provide a valid number'
    },{
      required: true,
      message: 'Cannot be empty'
    }
  ];

  buttonColor = (ind) => {
    switch (ind) {
      default:
        return '#6A5ACD';
      case 1:
        return '#DDA0DD';
      case 2:
        return '#6B8E23';
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form;

    const clickPoint = (<p>Select a Point</p>)

    const giveHeight = (ind) => (
        <Form.Item>
          <Row>
            <Col span={24} style={{textAlign: 'center'}}>
              <h4>Height</h4>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{textAlign: 'center'}}>
              {getFieldDecorator(`height${ind}`, {
                rules: [...this.numberInputRules],
                initialValue: this.props.editingInnerPlanePoints ?
                  this.props.editingInnerPlanePoints[
                    this.props.threePointsInfo[this.props.roofIndex][ind].pointIndex
                  ].height :
                  0
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
    )

    const OnePoint = (ind) => (
      <Col span={8}>
        <Popover
          content={
            this.props.threePointsInfo[this.props.roofIndex] &&
            Object.keys(this.props.threePointsInfo[this.props.roofIndex]).includes(ind.toString()) ?
            giveHeight(ind) :
            clickPoint
          }
          trigger='click'
          arrowPointAtCenter={true}
          onVisibleChange={vis => {
            if (vis === false) this.props.showAllRoofPlane();
          }}
        >
          <Button
            type={
              this.props.threePointsInfo[this.props.roofIndex] &&
              Object.keys(this.props.threePointsInfo[this.props.roofIndex])
              .includes(ind.toString()) ?
              'default' :
              'danger'
            }
            style={{
              backgroundColor:
                this.props.threePointsInfo[this.props.roofIndex] &&
                Object.keys(this.props.threePointsInfo[this.props.roofIndex])
                .includes(ind.toString()) ?
                this.buttonColor(ind) :
                null
            }}
            shape="circle"
            size='small'
            onClick={() => {
              if (this.props.threePointsInfo[this.props.roofIndex]) {
                this.props.showOnlyOneRoofPlane(this.props.entityId, ind);
                if (
                  !Object.keys(this.props.threePointsInfo[this.props.roofIndex])
                  .includes(ind.toString())
                ) this.props.setUIStateEditingRoofTop();
              } else {
                this.props.showOnlyOneRoofPlane(this.props.entityId, ind);
                this.props.setUIStateEditingRoofTop()
              }
            }}
          />
        </Popover>
      </Col>
    )

    const ThreePoints = (
      <div>
        <Row type="flex" justify="center">
          <h4>Provide the height of three points</h4>
        </Row>
        <Row style={{'textAlign':'center'}}>
          {OnePoint(0)}
          {OnePoint(1)}
          {OnePoint(2)}
        </Row>
    </div>
  )


    return (
      <Form>
        {ThreePoints}
      </Form>
    );
  }
};

const mapStateToProps = state => {
  return {
    editingInnerPlanePoints:
      state.undoableReducer.present.drawingRooftopManagerReducer
      .editingInnerPlanePoints,
    threePointsInfo:
      state.undoableReducer.present.drawingRooftopManagerReducer.threePointsInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateBuilding: (values) =>
      dispatch(actions.updateBuilding(values)),
    createPolygonFoundationWrapper: () =>
      dispatch(actions.createPolygonFoundationWrapper()),
    showOnlyOneRoofPlane: (roofId, threePointIndex) =>
      dispatch(actions.showOnlyOneRoofPlane(roofId, threePointIndex)),
    showAllRoofPlane: () => dispatch(actions.showAllRoofPlane()),
    setUIStateEditingRoofTop: () =>
      dispatch(actions.setUIStateEditingRoofTop())
  };
};

const formOptions = {
  name: 'editRoof',
  onValuesChange: (props, changedValues, allValues) => {
    let valueValid = true
    Object.keys(allValues).forEach(k => {
      if (typeof(allValues[k]) !== 'number') {
        valueValid = false
      }
    })
    if (valueValid && Object.keys(allValues).length === 3) {
      console.log(allValues)
      console.log(props.threePointsInfo)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create(formOptions)(EditInnerRoofForm));
