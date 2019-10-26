import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Cesium from 'cesium';
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
import * as turf from '@turf/turf';

import {makeUnionPolygonGeoJson} from '../../../../infrastructure/math/geoJSON';
import * as actions from '../../../../store/actions/index';
import * as MyMath from '../../../../infrastructure/math/math';
import Coordinate from '../../../../infrastructure/point/coordinate';
import MathLine from '../../../../infrastructure/math/mathLine';
import MathLineCollection from '../../../../infrastructure/math/mathLineCollection';
import Point from '../../../../infrastructure/point/point';
import Polyline from '../../../../infrastructure/line/polyline';
import FoundLine from '../../../../infrastructure/line/foundLine';
const { Option } = Select;
const { TabPane } = Tabs;

class SetUpPVPanel extends Component {
  state = {
    tab: 'manual',
    ...this.props.parameters
  }

  makeCombiGeometry = (props) => {
    const geoFoundation =
      props.workingBuilding.foundationPolygonExcludeStb.map(polygon =>
        polygon.toFoundLine().makeGeoJSON()
      );
    const geoNormalKeepout =
      props.allNormalKeepout.map(kpt => kpt.keepout.outlinePolygonPart2
      .toFoundLine().makeGeoJSON())
    const geoPassageKeepout =
      props.allPassageKeepout.map(kpt => kpt.keepout.outlinePolygon
      .toFoundLine().makeGeoJSON())
    const geoVentKeepout =
      props.allVentKeepout.map(kpt => kpt.keepout.outlinePolygon.toFoundLine()
      .makeGeoJSON())
    const geoNormalKeepoutInOne = makeUnionPolygonGeoJson(geoNormalKeepout);
    const geoPassageKeepoutInOne = makeUnionPolygonGeoJson(geoPassageKeepout);
    const geoVentKeepoutInOne = makeUnionPolygonGeoJson(geoVentKeepout);

    let keepoutCombi = null;
    let finalCombi = null;
    if (geoNormalKeepoutInOne.geometry.coordinates.length !== 0) {
      keepoutCombi = geoNormalKeepoutInOne
      if(geoPassageKeepoutInOne.geometry.coordinates.length !== 0) {
        keepoutCombi = turf.union(keepoutCombi, geoPassageKeepoutInOne);
      }
      if(geoVentKeepoutInOne.geometry.coordinates.length !== 0) {
        keepoutCombi = turf.union(keepoutCombi, geoVentKeepoutInOne);
      }
      finalCombi = geoFoundation.map(geo => {
        const diff = turf.difference(geo, keepoutCombi);
        if (typeof(diff.geometry.coordinates[0][0][0]) === 'number') {
          diff.geometry.coordinates = [diff.geometry.coordinates];
          return diff;
        } else {
          return diff;
        }
      });
    }
    else if (geoPassageKeepoutInOne.geometry.coordinates.length !== 0) {
      keepoutCombi = geoPassageKeepoutInOne;
      if(geoVentKeepoutInOne.geometry.coordinates.length !== 0) {
        keepoutCombi = turf.union(keepoutCombi, geoVentKeepoutInOne);
      }
      finalCombi = geoFoundation.map(geo => {
        const diff = turf.difference(geo, keepoutCombi);
        if (typeof(diff.geometry.coordinates[0][0][0]) === 'number') {
          diff.geometry.coordinates = [diff.geometry.coordinates];
          return diff;
        } else {
          return diff;
        }
      });
    }
    else if (geoVentKeepoutInOne.geometry.coordinates.length !== 0) {
      keepoutCombi = geoVentKeepoutInOne;
      finalCombi = geoFoundation.map(geo => {
        const diff = turf.difference(geo, keepoutCombi);
        if (typeof(diff.geometry.coordinates[0][0][0]) === 'number') {
          diff.geometry.coordinates = [diff.geometry.coordinates];
          return diff;
        } else {
          return diff;
        }
      });
    }
    else {
      finalCombi = geoFoundation
      finalCombi.forEach(geo =>
        geo.geometry.coordinates = [[...geo.geometry.coordinates]]
      );
    }
    return finalCombi;
  }

  makeRequestData = (props) => {
    const finalCombi = this.makeCombiGeometry(props);
    // console.log(finalCombi)
    const requestData = []
    finalCombi.forEach(roof => {
      roof.geometry.coordinates.forEach(partialRoof => {
        // console.log(partialRoof)
        const startAndLastPoint = new Point(
          partialRoof[0][0][0], partialRoof[0][0][1],
          props.workingBuilding.foundationHeight
        );
        const roofFoundLine = new FoundLine([
          startAndLastPoint,
          ...(partialRoof[0].slice(1,-1).map(cor => new Point(
            cor[0], cor[1], props.workingBuilding.foundationHeight
          ))),
          startAndLastPoint
        ]);
        const allKeepoutFoundLine = partialRoof.slice(1).map(kpt => {
          const startAndLastPoint = new Point(
            kpt[0][0], kpt[0][1], props.workingBuilding.foundationHeight
          );
          return new FoundLine([
            startAndLastPoint,
            ...(kpt.slice(1,-1).map(cor => new Point(
              cor[0], cor[1], props.workingBuilding.foundationHeight
            ))),
            startAndLastPoint
          ]);
        })
        requestData.push([roofFoundLine, allKeepoutFoundLine]);
      })
    })
    console.log(requestData)
    // let panelLayout = [0,[]];
    // requestData.forEach(partialRoof => {
    //   const output = calculateFlatRoofPanel(
    //     partialRoof[0], partialRoof[1], 'center', 360, 2, 1, 5, 0.1, 0, 30, 0
    //   );
    //   panelLayout[0] += output[0];
    //   panelLayout[1] = panelLayout[1].concat(output[1]);
    // })
    // props.initEditingPanels(panelLayout[1]);
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  tabCallback = (key) => {
    this.setState({tab:key})
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
            onChange = {this.tabCallback}
          >
            <TabPane tab="Manual" key="manual">
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
            </TabPane>
            <TabPane tab="Max Panels" key="max">
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
                      initialValue: 'max'
                    })(
                      <Input disabled />
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
                      initialValue: 'auto'
                    })(
                      <InputNumber disabled />
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
                      <InputNumber />
                    )}
                  </Col>
                </Row>
              </Form.Item>
              {/*Col Space*/}
              {colSpacing}
              {/*Align*/}
              {align}
            </TabPane>
            <TabPane tab="Max Eco" key="eco">
            </TabPane>
          </Tabs>

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
            <Col span={16}>
              <Button type='primary' shape='round' icon='plus' size='large'
                htmlType="submit" block
              >
                Create a Building
              </Button>
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
    workingBuilding: state.buildingManagerReducer.workingBuilding,
    allNormalKeepout: state.keepoutManagerReducer.normalKeepout,
    allPassageKeepout: state.keepoutManagerReducer.passageKeepout,
    allVentKeepout: state.keepoutManagerReducer.ventKeepout
  };
};

const mapDispatchToProps = dispatch => {
  return {
    initEditingPanels: (panels) => dispatch(actions.initEditingPanels(panels)),
    setDebugPolylines: (polylines) => dispatch(actions.setDebugPolylines(polylines)),
    setDebugPoints: (points) => dispatch(actions.setDebugPoints(points))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'setupPVPanel' })(SetUpPVPanel));
