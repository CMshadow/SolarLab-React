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
          "lon": -117.84138008952,
          "lat": 33.647053651536,
          "height": 5,
          "heightOffset": 0,
          "entityId": "357131a0-f2f9-11e9-9523-a32c1a6aa8fa",
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
          "lon": -117.84110106389,
          "lat": 33.646874469142,
          "height": 5,
          "heightOffset": 0,
          "entityId": "357131a1-f2f9-11e9-9523-a32c1a6aa8fa",
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
          "lon": -117.840979991243,
          "lat": 33.647010393716,
          "height": 5,
          "heightOffset": 0,
          "entityId": "357131a2-f2f9-11e9-9523-a32c1a6aa8fa",
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
          "lon": -117.841257323237,
          "lat": 33.647191009467,
          "height": 5,
          "heightOffset": 0,
          "entityId": "357131a3-f2f9-11e9-9523-a32c1a6aa8fa",
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
          "lon": -117.84138008952,
          "lat": 33.647053651536,
          "height": 5,
          "heightOffset": 0,
          "entityId": "357131a0-f2f9-11e9-9523-a32c1a6aa8fa",
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
      "entityId": "357131a4-f2f9-11e9-9523-a32c1a6aa8fa",
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
    [
      {
        "points": [
          {
            "lon": -117.841275768684,
            "lat": 33.647050741263,
            "height": 5,
            "heightOffset": 0,
            "entityId": "357131a5-f2f9-11e9-9523-a32c1a6aa8fa",
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
            "lon": -117.841222107133,
            "lat": 33.647032277927,
            "height": 5,
            "heightOffset": 0,
            "entityId": "357131a6-f2f9-11e9-9523-a32c1a6aa8fa",
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
            "lon": -117.841203686831,
            "lat": 33.647096102272,
            "height": 5,
            "heightOffset": 0,
            "entityId": "357131a7-f2f9-11e9-9523-a32c1a6aa8fa",
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
            "lon": -117.841266708346,
            "lat": 33.647092418363,
            "height": 5,
            "heightOffset": 0,
            "entityId": "357131a8-f2f9-11e9-9523-a32c1a6aa8fa",
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
            "lon": -117.841275768684,
            "lat": 33.647050741263,
            "height": 5,
            "heightOffset": 0,
            "entityId": "357131a5-f2f9-11e9-9523-a32c1a6aa8fa",
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
        "entityId": "357131a9-f2f9-11e9-9523-a32c1a6aa8fa",
        "name": "polyline",
        "color": {
          "red": 1,
          "green": 1,
          "blue": 1,
          "alpha": 1
        },
        "show": true,
        "width": 4
      }
    ]
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
      <Button onClick={() => calculateFlatRoofPanelSection1(
        FoundLine.fromPolyline(data[0][0]), data[0][1].map(d => FoundLine.fromPolyline(d)), 0, 2, 1, 5, 0.1, 0, 10, 0
      )}>TEST</Button>
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
    saveBuildingInfoFields: (values) => dispatch(actions.saveBuildingInfoFields(values))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'createBuilding' })(CreateBuildingPanel));
