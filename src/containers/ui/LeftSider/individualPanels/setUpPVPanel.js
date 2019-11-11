import React, { Component } from 'react';
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
  Radio,
  Tabs
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectanglePortrait, faRectangleLandscape } from '@fortawesome/pro-light-svg-icons'

import * as actions from '../../../../store/actions/index';
const { Option } = Select;
const { TabPane } = Tabs;
const ButtonGroup = Button.Group;

class SetUpPVPanel extends Component {
  state = {
    tab: 'manual',
    ...this.props.parameters
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.setupPanelParams(values)
        this.props.generatePanels()
      }
    });
  }

  numberInputRules = [{
    type: 'number',
    message: 'Please provide a valid number'
  },{
    required: true,
    message: 'Cannot be empty'
  }];

  integerInputRules = [{
    type: 'integer',
    message: 'Please provide a integer only'
  },{
    required: true,
    message: 'Cannot be empty'
  }];

  render = () => {
    const { getFieldDecorator } = this.props.form;

    const pitchedRoofSelect = (
      <Form.Item>
        <Row>
          <Col span={20} offset={2}>
          {getFieldDecorator('pitchedRoofIndex', {
            rules: [{
              required: true,
              message: 'Please select one'
            }]
          })(
            <Select
              placeholder='Select a pitched roof'
            >
              {this.props.rooftopCollection.map((r,ind) =>
                <Option
                  key={ind}
                  value={ind}
                >
                  {`Pitched Roof {ind}`}
                </Option>
              )}
            </Select>
          )}
          </Col>
        </Row>
      </Form.Item>
    );

    const panelOrientation = (
      <Form.Item>
        <Row>
          <Col span={10} offset={4}>
            <Tooltip
              placement="topLeft"
              title="The orientation of panels, portrait or landscape"
            >
              <h4>Panel Orientation <Icon type="question-circle" /></h4>
            </Tooltip>
          </Col>
          <Col span={8}>
            {getFieldDecorator('orientation', {
              initialValue: this.state.orientation
            })(
              <Radio.Group buttonStyle='solid'>
                <Radio.Button value="portrait">
                  <FontAwesomeIcon icon={faRectanglePortrait} />
                </Radio.Button>
                <Radio.Button value="landscape">
                  <FontAwesomeIcon icon={faRectangleLandscape} />
                </Radio.Button>
              </Radio.Group>
            )}
          </Col>
        </Row>
      </Form.Item>
    );

    const colSpacing = (
      <Form.Item>
        <Row>
          <Col span={10} offset={4}>
            <Tooltip
              placement="topLeft"
              title="The spacing between two panels in one row"
            >
              <h4>Panel Spacing <Icon type="question-circle" /></h4>
            </Tooltip>
          </Col>
          <Col span={6}>
            {getFieldDecorator('colSpace', {
              rules: [...this.numberInputRules],
              initialValue: this.state.colSpace
            })(
              <InputNumber
                min={0}
                max={30}
                step={5}
                formatter={value => `${value}m`}
                parser={value => value.replace('m', '')}
                onChange = {e => this.setState({colSpace:e})}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    );

    const align = (
      <Form.Item>
        <Row>
          <Col span={8} offset={4}>
            <Tooltip
              placement="topLeft"
              title="Panel alignments to the left edge, center, or right edge"
            >
              <h4>Align <Icon type="question-circle" /></h4>
            </Tooltip>
          </Col>
          <Col span={12}>
            {getFieldDecorator('align', {
              initialValue: this.state.align
            })(
              <Radio.Group buttonStyle='solid'>
                <Radio.Button value="left">
                  <Icon type="align-left" />
                </Radio.Button>
                <Radio.Button value="center">
                  <Icon type="align-center" />
                </Radio.Button>
                <Radio.Button value="right">
                  <Icon type="align-right" />
                </Radio.Button>
              </Radio.Group>
            )}
          </Col>
        </Row>
      </Form.Item>
    );

    const optionalRowPerArray = (
      <Form.Item>
        <Row>
          <Col span={10} offset={4}>
            <Tooltip
              placement="topLeft"
              title="The number of rows for a panel array"
            >
              <h4>Rows / Array <Icon type="question-circle" /></h4>
            </Tooltip>
          </Col>
          <Col span={6}>
            {getFieldDecorator('rowPerArray', {
              rules: [...this.numberInputRules],
              initialValue: this.state.rowPerArray
            })(
              <InputNumber
                min={0}
                max={10}
                step={1}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    );
    const optionalPanelPerRow = (
      <Form.Item>
        <Row>
          <Col span={10} offset={4}>
            <Tooltip
              placement="topLeft"
              title="The number of panels on each row"
            >
              <h4>Panels / Row <Icon type="question-circle" /></h4>
            </Tooltip>
          </Col>
          <Col span={6}>
            {getFieldDecorator('panelPerRow', {
              rules: [...this.integerInputRules],
              initialValue: this.state.panelPerRow
            })(
              <InputNumber
                min={0}
                max={30}
                step={1}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    );

    return (
      <div>
        <Row type="flex" justify="center">
          <h3>Setup PV Panels on Roof</h3>
        </Row>
        <Form onSubmit={this.handleSubmit}>

          <Tabs
            defaultActiveKey = {this.state.tab}
            size = 'small'
            tabBarGutter = {5}
            tabBarStyle = {{textAlign: 'center'}}
            onChange = {e => this.setState({tab:e})}
          >
            <TabPane tab="Manual" key="manual">
            </TabPane>
            <TabPane tab="Max Panels" key="max">
            </TabPane>
            <TabPane tab="Max Eco" key="eco">
            </TabPane>
          </Tabs>

          

          {/*Select Panel*/}
          <Form.Item>
            <Row>
              <Col span={20} offset={2}>
              {getFieldDecorator('panelID', {
                rules: [{
                  required: true,
                  message: 'Please select one'
                }]
              })(
                <Select
                  showSearch
                  optionFilterProp='children'
                  placeholder='Select a panel'
                >
                  {this.props.userPanels.map(d =>
                    <Option
                      key={d.panelID}
                      value={d.panelID}
                    >
                      {d.panelName}
                    </Option>
                  )}
                </Select>
              )}
              </Col>
            </Row>
          </Form.Item>

          {/*Panel Azimuth*/}
          <Form.Item>
            <Row>
              <Col span={10} offset={4}>
                <Tooltip
                  placement="topLeft"
                  title="The azimuth of the panels, 180° is south, 0° is north"
                >
                  <h4>Panel Azimuth <Icon type="question-circle" /></h4>
                </Tooltip>
              </Col>
              <Col span={6}>
                {getFieldDecorator('azimuth', {
                  rules: [...this.numberInputRules],
                  initialValue: this.state.azimuth
                })(
                  <InputNumber
                    min={0}
                    max={360}
                    step={1}
                    formatter={value => `${value}\xB0`}
                    parser={value => value.replace('\xB0', '')}
                    onChange = {e => this.setState({azimuth:e})}
                  />
                )}
              </Col>
            </Row>
          </Form.Item>
          {/*Panel Tilt*/}
          <Form.Item>
            <Row>
              <Col span={10} offset={4}>
                <Tooltip
                  placement="topLeft"
                  title="Panel tilt angle"
                >
                  <h4>Panel Tilt <Icon type="question-circle" /></h4>
                </Tooltip>
              </Col>
              <Col span={6}>
                {getFieldDecorator('tilt', {
                  rules: [...this.numberInputRules],
                  initialValue: this.state.tilt
                })(
                  <InputNumber
                    min={0}
                    max={45}
                    step={5}
                    formatter={value => `${value}\xB0`}
                    parser={value => value.replace('\xB0', '')}
                    onChange = {e => this.setState({tilt:e})}
                  />
                )}
              </Col>
            </Row>
          </Form.Item>
          {/*Panel Orientation*/}
          {panelOrientation}
          {/*Row Space*/}
          <Form.Item>
            <Row>
              <Col span={10} offset={4}>
                <Tooltip
                  placement="topLeft"
                  title="The spacing between each row of panels"
                >
                  <h4>Row Spacing <Icon type="question-circle" /></h4>
                </Tooltip>
              </Col>
              <Col span={6}>
                {getFieldDecorator('rowSpace', {
                  rules: [...this.numberInputRules],
                  initialValue: this.state.rowSpace
                })(
                  <InputNumber
                    min={0}
                    max={30}
                    step={5}
                    formatter={value => `${value}m`}
                    parser={value => value.replace('m', '')}
                    onChange = {e => this.setState({rowSpace:e})}
                  />
                )}
              </Col>
            </Row>
          </Form.Item>
          {/*Col Space*/}
          {colSpacing}
          {/*Align*/}
          {align}

          <Divider />
          {/*Mode*/}
          <Form.Item>
            <Row>
              <Col span={8} offset={4}>
                <Tooltip
                  placement="topLeft"
                  title="Individual panels or a fixed number of panels to form a panel array"
                >
                  <h4>Mode <Icon type="question-circle" /></h4>
                </Tooltip>
              </Col>
              <Col span={10}>
                {getFieldDecorator('mode', {
                  initialValue: this.state.mode
                })(
                  <Select
                    onChange={e => this.setState({mode:e})}
                  >
                    <Option value='individual'>Individual</Option>
                    <Option value='array'>Panel Array</Option>
                  </Select>
                )}
              </Col>
            </Row>
          </Form.Item>

          {
            this.state.mode === 'array' ? optionalRowPerArray : null
          }
          {
            this.state.mode === 'array' ? optionalPanelPerRow : null
          }

          {/*The button to validate & process to create a new building*/}
          <Row type="flex" justify="center">
            <Col span={20} offset={2}>
              <ButtonGroup>
                <Button type='primary' shape='round' size='large'
                  htmlType="submit" loading={this.props.backendLoading}
                >
                  Preview
                </Button>
                <Button type='primary' shape='round' size='large' disabled>
                  Continue <Icon type='right' />
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    parameters: state.undoableReducer.present.editingPVPanelManagerReducer
      .parameters,
    backendLoading: state.projectManagerReducer.backendLoading,
    userPanels: state.undoableReducer.present.editingPVPanelManagerReducer.userPanels,
    rooftopCollection: state.undoableReducer.present.drawingRooftopManager
      .RooftopCollection.rooftopCollection
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setupPanelParams: (values) => dispatch(actions.setupPanelParams(values)),
    generatePanels: () => dispatch(actions.generatePanels()),
    setDebugPolylines: (polylines) => dispatch(actions.setDebugPolylines(polylines)),
    setDebugPoints: (points) => dispatch(actions.setDebugPoints(points))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'setupPVPanel' })(SetUpPVPanel));
