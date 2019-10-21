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

import * as classes from './createBuildingPanel.module.css';
import * as actions from '../../../../store/actions/index';
import {calculateFlatRoofPanelSection1} from './setUpPVPanel';
import FoundLine from '../../../../infrastructure/line/foundLine';
const { Option } = Select;

const data = [
  [
    {
      "points": [
        {
          "lon": -117.841039807617,
          "lat": 33.646943680344,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67a0-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841102220906,
          "lat": 33.646874737449,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67a1-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841383804813,
          "lat": 33.647051394341,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67a2-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841256834048,
          "lat": 33.647191648738,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67a3-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.840975249954,
          "lat": 33.647014991955,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67a4-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841033300782,
          "lat": 33.646950867917,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67a5-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841196371416,
          "lat": 33.647045070939,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67a6-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841195213277,
          "lat": 33.647047251731,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67a7-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841194056742,
          "lat": 33.647050071821,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67a8-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841193199858,
          "lat": 33.647052965091,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67a9-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841192649149,
          "lat": 33.647055909522,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67aa-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841192408805,
          "lat": 33.647058882705,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67ab-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841192480655,
          "lat": 33.647061862012,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67ac-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841192864153,
          "lat": 33.647064824769,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67ad-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.84119355638,
          "lat": 33.647067748428,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67ae-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841194552068,
          "lat": 33.647070610737,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67af-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841195843638,
          "lat": 33.647073389912,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67b0-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841218978173,
          "lat": 33.647064955907,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67b1-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841242327287,
          "lat": 33.647104849115,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67b2-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841286998993,
          "lat": 33.647055185839,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67b3-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841235323838,
          "lat": 33.64704551847,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67b4-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841237967919,
          "lat": 33.647025738876,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67b5-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841234396385,
          "lat": 33.647025538799,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67b6-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841230817495,
          "lat": 33.647025598613,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67b7-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841227258486,
          "lat": 33.647025917863,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67b8-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841223746444,
          "lat": 33.647026494119,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67b9-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841220308098,
          "lat": 33.647027322996,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67ba-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841216969616,
          "lat": 33.647028398186,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67bb-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841213756405,
          "lat": 33.647029711505,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67bc-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841210692921,
          "lat": 33.647031252959,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67bd-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841207802477,
          "lat": 33.647033010815,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67be-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841205107073,
          "lat": 33.647034971697,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67bf-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841202627221,
          "lat": 33.647037120679,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67c0-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841202243866,
          "lat": 33.64703751689,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67c1-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        },
        {
          "lon": -117.841039807617,
          "lat": 33.646943680344,
          "height": 5,
          "heightOffset": 0,
          "entityId": "85cc67a0-f3d5-11e9-b2d8-3b11d872468c",
          "name": "vertex",
          "color": {
            "red": 1,
            "green": 1,
            "blue": 1,
            "alpha": 1
          },
          "pixelSize": 15,
          "show": true,
          "render": true
        }
      ],
      "entityId": "85cc67c2-f3d5-11e9-b2d8-3b11d872468c",
      "name": "polyline",
      "color": {
        "red": 1,
        "green": 1,
        "blue": 1,
        "alpha": 1
      },
      "show": true,
      "width": 4
    },
    []
  ]
]

class CreateBuildingPanel extends PureComponent {
  state = {
    mode: this.props.buildingInfoFields.mode,
    type: this.props.buildingInfoFields.type
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.setUIStateReadyDrawing();
        this.props.initBuilding(values);
        console.log('[Create Building Panel] Your are creating a new building')
      }
    });
  };

  componentWillUnmount = () => {
    this.props.saveBuildingInfoFields(this.props.form.getFieldsValue());
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

    const optionalFoundHtInput = (
      <Form.Item>
        <Row>
          <Col {...this.rowLayout.label}>
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
          <Col {...this.rowLayout.field}>
            {getFieldDecorator('foundHt', {
              rules: [...this.numberInputRules],
              initialValue: this.props.buildingInfoFields.foundHt
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
    );
    const optionalParapetHtInput = (
      <Form.Item>
        <Row>
          <Col {...this.rowLayout.label}>
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
          <Col {...this.rowLayout.field}>
            {getFieldDecorator('parapetHt', {
              rules: [...this.numberInputRules],
              initialValue: this.props.buildingInfoFields.parapetHt
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
    const optionalHipStbInput = (
      <Form.Item>
        <Row>
          <Col {...this.rowLayout.label}>
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
          <Col {...this.rowLayout.field}>
            {getFieldDecorator('hipStb', {
              rules: [...this.numberInputRules],
              initialValue: this.props.buildingInfoFields.hipStb
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
    const optionalRidgeStbInput = (
      <Form.Item>
        <Row>
          <Col {...this.rowLayout.label}>
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
          <Col {...this.rowLayout.field}>
            {getFieldDecorator('ridgeStb', {
              rules: [...this.numberInputRules],
              initialValue: this.props.buildingInfoFields.ridgeStb
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

    return (
      <div>
      <Form onSubmit={this.handleSubmit}>
        {/*Bulding name Input*/}
        <Form.Item>
          <Row>
            <Col span={20} offset={2}>
              <h3> Building Name </h3>
            </Col>
          </Row>
          <Row>
            <Col span={20} offset={2}>
              {getFieldDecorator('name', {
                initialValue: this.props.buildingInfoFields.name,
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
            </Col>
          </Row>
        </Form.Item>

        {/*Bulding type Select*/}
        <Form.Item>
          <Row>
            <Col span={10} offset={2}>
              <h4> Building Type </h4>
            </Col>
            <Col span={10}>
              {getFieldDecorator('type', {
                initialValue: this.props.buildingInfoFields.type
              })(
                <Select
                  className={classes.inputArea}
                  onChange={(value,option) => {
                    this.setState({type:value});
                  }}>
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
            <Col span={12} offset={2}>
              <h3>Working on </h3>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={20}>
              {getFieldDecorator('mode', {
                initialValue: this.state.mode
              })(
                <Radio.Group
                  onChange={event => {
                    this.setState({mode: event.target.value});
                  }}
                  buttonStyle='solid'
                >
                  <Radio.Button value="2D">Satellite Map</Radio.Button>
                  <Radio.Button value="3D">Drone 3D Model</Radio.Button>
                </Radio.Group>
              )}
            </Col>
          </Row>
        </Form.Item>
        {this.state.mode === '3D' ? null : optionalFoundHtInput}
        {this.state.mode === '2D' &&
          this.state.type === 'FLAT' ?
          optionalParapetHtInput :
          null
        }

        {/*All setbacks inputs go to here*/}
        <Divider />
        <Form.Item>
          <Row>
            <Col {...this.rowLayout.label}>
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
            <Col {...this.rowLayout.field}>
              {getFieldDecorator('eaveStb', {
                rules: [...this.numberInputRules],
                initialValue: this.props.buildingInfoFields.eaveStb
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
        {this.state.type  === 'PITCHED' ?
          optionalHipStbInput :
          null
        }
        {this.state.type  === 'PITCHED' ?
          optionalRidgeStbInput :
          null
        }

        {/*The button to validate & process to create a new building*/}
        <Row type="flex" justify="center">
          <Col span={16}>
            <Button type='primary' shape='round' icon='plus' size='large'
              htmlType="submit" block
            >
              Create a Building
            </Button>
          </Col>
        </Row>
      </Form>
      <Button onClick={() => {
        const panelLayout = calculateFlatRoofPanelSection1(
          FoundLine.fromPolyline(data[0][0]), data[0][1].map(d => FoundLine.fromPolyline(d)), 0, 2, 1, 5, 0.1, 0, 10, 0, this.props
        );
        console.log(panelLayout)
        this.props.initEditingPanels(panelLayout[1]);
      }}>TEST</Button>
    </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    buildingInfoFields: state.buildingManagerReducer.buildingInfoFields
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUIStateReadyDrawing: () => dispatch(actions.setUIStateReadyDrawing()),
    initBuilding: (values) => dispatch(actions.initBuilding(values)),
    saveBuildingInfoFields: (values) => dispatch(actions.saveBuildingInfoFields(values)),
    initEditingPanels: (panels) => dispatch(actions.initEditingPanels(panels)),
    setDebugPolylines: (polylines) => dispatch(actions.setDebugPolylines(polylines))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'createBuilding' })(CreateBuildingPanel));
