import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form,
  InputNumber,
  Divider,
  Tooltip,
  Icon,
  Select,
  Row,
  Col,
  Button,
  Radio,
  Tabs,
  Spin
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectanglePortrait, faRectangleLandscape } from '@fortawesome/pro-light-svg-icons'
import { injectIntl, FormattedMessage } from 'react-intl';

import './FormInputArea.css';
import * as actions from '../../../../store/actions/index';
import axios from '../../../../axios-setup';
import * as MyMath from '../../../../infrastructure/math/math';
import BearingCollection from '../../../../infrastructure/math/bearingCollection';
import errorNotification from '../../../../components/ui/Notification/ErrorNotification';
import { minPanelTiltAngleOnPitchedRoof } from '../../../../infrastructure/math/pointCalculation';

const { Option } = Select;
const { TabPane } = Tabs;
const ButtonGroup = Button.Group;

class SetUpPVPanel extends Component {
  state = {
    tab: 'manual',
    isFetching: false,
    selectRoofIndex: null,
    selectPanelID: null,
    ...this.props.parameters
  }

  setIsFetchingTrue = () => {
    this.setState({
      isFetching: true
    });
  }

  setIsFetchingFalse = () => {
    this.setState({
      isFetching: false
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.setupPanelParams(values, this.state.selectRoofIndex || 0)
        this.props.generatePanels(this.state.selectRoofIndex || 0)
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

  updateFormFields = (roofInd) => {
    this.props.form.setFieldsValue({
      orientation: this.props.roofSpecParams.hasOwnProperty(roofInd) ?
        this.props.roofSpecParams[roofInd].orientation :
        this.state.orientation,
      colSpace: this.props.roofSpecParams.hasOwnProperty(roofInd) ?
        this.props.roofSpecParams[roofInd].colSpace :
        this.state.colSpace,
      rowSpace: this.props.roofSpecParams.hasOwnProperty(roofInd) ?
        this.props.roofSpecParams[roofInd].rowSpace :
        this.state.rowSpace,
      align: this.props.roofSpecParams.hasOwnProperty(roofInd) ?
        this.props.roofSpecParams[roofInd].align :
        this.state.align,
      azimuth: this.props.roofSpecParams.hasOwnProperty(roofInd) ?
        this.props.roofSpecParams[roofInd].azimuth :
        this.state.azimuth,
      tilt: this.props.roofSpecParams.hasOwnProperty(roofInd) ?
        this.props.roofSpecParams[roofInd].tilt :
        this.state.tilt,
      mode: this.props.roofSpecParams.hasOwnProperty(roofInd) ?
        this.props.roofSpecParams[roofInd].mode :
        this.state.mode
    });
    if (this.props.roofSpecParams.hasOwnProperty(roofInd)) {
      this.setState({mode: this.props.roofSpecParams[roofInd].mode})
    }
    if (this.props.form.getFieldValue('mode') === 'array') {
      this.props.form.setFieldsValue({
        rowPerArray: this.props.roofSpecParams.hasOwnProperty(roofInd) ?
          this.props.roofSpecParams[roofInd].rowPerArray :
          this.state.rowPerArray,
        panelPerRow: this.props.roofSpecParams.hasOwnProperty(roofInd) ?
          this.props.roofSpecParams[roofInd].panelPerRow :
          this.state.panelPerRow
      })
    }
  }

  determineRowSpace = (shadowFactor, orientation, panelID) => {
    const panelInd = this.props.userPanels.reduce((findIndex, elem, i) =>
      elem.panelID === panelID ? i : findIndex, -1
    );
    let panelEdge = 2
    if (panelID) {
      switch(orientation) {
        default:
        case 'portrait':
          panelEdge = this.props.userPanels[panelInd].panelLength >
            this.props.userPanels[panelInd].panelWidth ?
            this.props.userPanels[panelInd].panelLength :
            this.props.userPanels[panelInd].panelWidth
          break;
        case 'landscape':
          panelEdge = this.props.userPanels[panelInd].panelLength <
            this.props.userPanels[panelInd].panelWidth ?
            this.props.userPanels[panelInd].panelLength :
            this.props.userPanels[panelInd].panelWidth
          break;
      }
    } else {
      switch(orientation) {
        default:
        case 'portrait':
          break;
        case 'landscape':
          panelEdge = 1;
      }
    }

    this.props.form.setFieldsValue({
      rowSpace: parseFloat((shadowFactor * panelEdge).toFixed(1))
    });
  }

  updateEcoFormFields = () => {
    this.props.form.setFieldsValue({
      azimuth: this.props.projectInfo.globalOptimalAzimuth,
      tilt: this.props.projectInfo.globalOptimalTilt
    });
    this.setState({
      azimuth: this.props.projectInfo.globalOptimalAzimuth,
      tilt: this.props.projectInfo.globalOptimalTilt
    });
    this.determineRowSpace(1.3, this.state.orientation, this.state.selectPanelID);
  }

  updateMaxFormFields = (roofIndex) => {
    let azimuth = null;

    switch(this.props.workingBuilding.type) {
      default:
      case 'FLAT': {
        const roofEdgesDist = this.props.workingBuilding.foundationPolygon[0]
          .toFoundLine().getSegmentDistance();
        const roofEdgesBrng = this.props.workingBuilding.foundationPolygon[0]
          .toFoundLine().getSegmentBearing();
        const distBrngCombo = roofEdgesDist.map((d,i) => {
          return {
            dist: d,
            brng: roofEdgesBrng[i]
          }
        });
        distBrngCombo.sort((a, b) => (b.dist - a.dist));

        const brngs = [];
        distBrngCombo.slice(0, 3).forEach(e => {
          brngs.push(e.brng);
          brngs.push(MyMath.mapBrng(e.brng + 90));
          brngs.push(MyMath.mapBrng(e.brng - 90));
          brngs.push(MyMath.mapBrng(e.brng + 180));
        })
        const brngCollection = new BearingCollection(brngs)

        if(this.props.projectInfo.projectLat > 0){
          azimuth = this.props.projectInfo.globalOptimalAzimuth ?
            Math.round(brngCollection.findClosestBrng(
              this.props.projectInfo.globalOptimalAzimuth
            )) :
            Math.round(brngCollection.findClosestBrng(180));
        } else{
          azimuth = this.props.projectInfo.globalOptimalAzimuth ?
            Math.round(brngCollection.findClosestBrng(
              this.props.projectInfo.globalOptimalAzimuth
            )) :
            Math.round(brngCollection.findClosestBrng(0));
        }
        this.setIsFetchingTrue();
        axios.get('/optimal-calculation/calculate-tilt', {
          params: {
            longitude: this.props.projectInfo.projectLon,
            latitude: this.props.projectInfo.projectLat,
            azimuth: azimuth
          }
        }).then(response => {
          this.setIsFetchingFalse();
          this.props.form.setFieldsValue({
            azimuth: azimuth,
            tilt: response.data.optimalTilt,
          });
          this.setState({
            azimuth: azimuth,
            tilt: response.data.optimalTilt
          });
          this.determineRowSpace(
            1.3, this.state.orientation, this.state.selectPanelID
          );
        }).catch(err => {
          this.setIsFetchingFalse();
          return errorNotification(
            'Backend Error',
            err.response.data.errorMessage
          );
        })
        break;
      }
      case 'PITCHED': {
        azimuth = roofIndex !== null ?
          Math.round(
            this.props.workingBuilding.pitchedRoofPolygons[roofIndex].brng
          ) :
          this.state.azimuth
        this.props.form.setFieldsValue({
          azimuth: azimuth,
          tilt: Math.ceil(
            this.props.workingBuilding.pitchedRoofPolygons[roofIndex].obliquity
          ),
        })
        this.setState({
          azimuth: azimuth,
          tilt: Math.ceil(
            this.props.workingBuilding.pitchedRoofPolygons[roofIndex].obliquity
          ),
        });
        this.determineRowSpace(
          1.3, this.state.orientation, this.state.selectPanelID
        );
        break;
      }
    }
  }

  render = () => {
    const { getFieldDecorator } = this.props.form;

    const pitchedRoofSelect = this.props.workingBuilding.type === 'PITCHED' ?
    (
      <Form.Item>
        <Row>
          <Col span={20} offset={2}>
          {getFieldDecorator('roofIndex', {
            rules: [{
              required: this.props.workingBuilding.type === 'PITCHED',
              message: 'Please select one'
            }]
          })(
            <Select
              placeholder='Select a pitched roof'
              onChange={(roofInd) => {
                this.setState({selectRoofIndex: roofInd});
                this.updateFormFields(roofInd)
                if (this.state.tab === 'max') {
                  this.updateMaxFormFields(roofInd);
                } else if (this.state.tab === 'eco') {
                  this.updateEcoFormFields();
                }
              }}
            >
              {this.props.workingBuilding.pitchedRoofPolygons.map((r,ind) =>
                <Option
                  key={ind}
                  value={ind}
                >
                  {`Pitched Roof ${ind+1}`}
                </Option>
              )}
            </Select>
          )}
          </Col>
        </Row>
      </Form.Item>
    ) :
    null;

    const panelSelect = (
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
              placeholder={this.props.intl.formatMessage({id:'select_a_panel'})}
              onChange={(e) => {
                this.setState({selectPanelID: e});
                if (this.state.tab !== 'manual') {
                  this.determineRowSpace(1.3, this.state.orientation, e)
                }
              }}
            >
              {this.props.userPanels.map(d =>
                <Option
                  key={d.panelID}
                  value={d.panelID}
                  title={d.panelName}
                >
                  {d.panelName}
                </Option>
              )}
            </Select>
          )}
          </Col>
        </Row>
      </Form.Item>
    )

    const panelAzimuth = (
      <Form.Item>
        <Row>
          <Col span={10} offset={2}>
            <Tooltip
              placement="topLeft"
              title={this.props.intl.formatMessage({id:'Azimuth_description'})}
            >
              <h4><FormattedMessage id='panel_azimuth' /> <Icon type="question-circle" /></h4>
            </Tooltip>
          </Col>
          <Col span={10}>
            {getFieldDecorator('azimuth', {
              rules: [...this.numberInputRules],
              initialValue: this.state.azimuth
            })(
              <InputNumber
                className='inputArea'
                min={0}
                max={360}
                step={1}
                formatter={value => `${value}\xB0`}
                parser={value => value.replace('\xB0', '')}
                onChange = {e => this.setState({azimuth:e})}
                disabled = {this.state.tab !== 'manual'}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    )

    const panelTilt = (
      <Form.Item>
        <Row>
          <Col span={10} offset={2}>
            <Tooltip
              placement="topLeft"
              title={this.props.intl.formatMessage({id:'Tilt_description'})}
            >
              <h4><FormattedMessage id='panel_tilt' /> <Icon type="question-circle" /></h4>
            </Tooltip>
          </Col>
          <Col span={10}>
            {getFieldDecorator('tilt', {
              rules: [...this.numberInputRules],
              initialValue: this.state.tilt
            })(
              <InputNumber
                className='inputArea'
                min={
                  this.state.selectRoofIndex !== null ?
                  Math.ceil(minPanelTiltAngleOnPitchedRoof(
                    this.props.workingBuilding.pitchedRoofPolygons[
                      this.state.selectRoofIndex
                    ].convertHierarchyToPoints(),
                    this.state.azimuth
                  )) :
                  0
                }
                max={45}
                step={5}
                formatter={value => `${value}\xB0`}
                parser={value => value.replace('\xB0', '')}
                onChange = {e => this.setState({tilt:e})}
                disabled = {this.state.tab === 'eco'}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    )

    const panelOrientation = (
      <Form.Item>
        <Row>
          <Col span={10} offset={2}>
            <Tooltip
              placement="topLeft"
              title={this.props.intl.formatMessage({id:'orientation_description'})}
            >
              <h4><FormattedMessage id='panel_orientation' /> <Icon type="question-circle" /></h4>
            </Tooltip>
          </Col>
          <Col span={10}>
            {getFieldDecorator('orientation', {
              initialValue: this.state.orientation
            })(
              <Radio.Group
                className='inputArea'
                buttonStyle='solid'
                onChange={(e) => {
                  this.setState({orientation: e.target.value})
                  if (this.state.tab !== 'manual') {
                    this.determineRowSpace(
                      1.3, e.target.value, this.state.selectPanelID
                    );
                  }
                }}
              >
                <Radio.Button className='halfInputArea' value="portrait">
                  <FontAwesomeIcon icon={faRectanglePortrait} />
                </Radio.Button>
                <Radio.Button className='halfInputArea' value="landscape">
                  <FontAwesomeIcon icon={faRectangleLandscape} />
                </Radio.Button>
              </Radio.Group>
            )}
          </Col>
        </Row>
      </Form.Item>
    );

    const rowSpacing = (
      <Form.Item>
        <Row>
          <Col span={10} offset={2}>
            <Tooltip
              placement="topLeft"
              title={this.props.intl.formatMessage({id:'row_spacing_description'})}
            >
              <h4><FormattedMessage id='row_spacing' /> <Icon type="question-circle" /></h4>
            </Tooltip>
          </Col>
          <Col span={10}>
            {getFieldDecorator('rowSpace', {
              rules: [...this.numberInputRules],
              initialValue:this.state.rowSpace
            })(
              <InputNumber
                className='inputArea'
                min={0}
                max={30}
                step={0.1}
                formatter={value => `${value}m`}
                parser={value => value.replace('m', '')}
                onChange = {e => this.setState({rowSpace:e})}
              />
            )}
          </Col>
        </Row>
      </Form.Item>
    )

    const colSpacing = (
      <Form.Item>
        <Row>
          <Col span={10} offset={2}>
            <Tooltip
              placement="topLeft"
              title={
                this.props.intl.formatMessage({id:'panel_spacing_description'})
              }
            >
              <h4><FormattedMessage id='panel_spacing' /> <Icon type="question-circle" /></h4>
            </Tooltip>
          </Col>
          <Col span={10}>
            {getFieldDecorator('colSpace', {
              rules: [...this.numberInputRules],
              initialValue: this.state.colSpace
            })(
              <InputNumber
                className='inputArea'
                min={0}
                max={30}
                step={0.1}
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
          <Col span={10} offset={2}>
            <Tooltip
              placement="topLeft"
              title={this.props.intl.formatMessage({id:'alignment_description'})}
            >
              <h4><FormattedMessage id='align_ment' /> <Icon type="question-circle" /></h4>
            </Tooltip>
          </Col>
          <Col span={10}>
            {getFieldDecorator('align', {
              initialValue: this.state.align
            })(
              <Radio.Group className='inputArea' buttonStyle='solid'>
                <Radio.Button className='oneThridInputArea' value="left">
                  <Icon type="align-left" />
                </Radio.Button>
                <Radio.Button className='oneThridInputArea' value="center">
                  <Icon type="align-center" />
                </Radio.Button>
                <Radio.Button className='oneThridInputArea' value="right">
                  <Icon type="align-right" />
                </Radio.Button>
              </Radio.Group>
            )}
          </Col>
        </Row>
      </Form.Item>
    );

    const mode = (
      <Form.Item>
        <Row>
          <Col span={10} offset={2}>
            <Tooltip
              placement="topLeft"
              title={this.props.intl.formatMessage({id:'layoutmode_description'})}
            >
              <h4><FormattedMessage id='layoutMode' /> <Icon type="question-circle" /></h4>
            </Tooltip>
          </Col>
          <Col span={10}>
            {getFieldDecorator('mode', {
              initialValue: this.state.mode
            })(
              <Select
                onChange={e => this.setState({mode:e})}
              >
                <Option value='individual'><FormattedMessage id='single_row_panel_layout' /></Option>
                <Option value='array'><FormattedMessage id='multi_row_panel_layout' /></Option>
              </Select>
            )}
          </Col>
        </Row>
      </Form.Item>
    )

    const optionalRowPerArray = (
      <Form.Item>
        <Row>
          <Col span={10} offset={2}>
            <Tooltip
              placement="topLeft"
              title={
                this.props.intl.formatMessage({id:'rows_per_array_description'})
              }
            >
              <h4>
                <FormattedMessage id='rows_per_array' />
                <Icon type="question-circle" />
              </h4>
            </Tooltip>
          </Col>
          <Col span={10}>
            {getFieldDecorator('rowPerArray', {
              rules: [...this.numberInputRules],
              initialValue: this.state.rowPerArray
            })(
              <InputNumber
                className='inputArea'
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
          <Col span={10} offset={2}>
            <Tooltip
              placement="topLeft"
              title={this.props.intl.formatMessage({id:'panel_per_row_description'})}
            >
              <h4>
                < FormattedMessage id='panel_per_row' />
                <Icon type="question-circle" />
              </h4>
            </Tooltip>
          </Col>
          <Col span={10}>
            {getFieldDecorator('panelPerRow', {
              rules: [...this.integerInputRules],
              initialValue: this.state.panelPerRow
            })(
              <InputNumber
                className='inputArea'
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
      <div style={{padding: '10px 10px 20px', overflow: 'auto'}}>
        <Row type="flex" justify="center">
          <h3><FormattedMessage id='setUpPVPanelonRoof' /></h3>
        </Row>
        <Form onSubmit={this.handleSubmit}>

          {pitchedRoofSelect}

          {panelSelect}

          <Tabs
            defaultActiveKey = {this.state.tab}
            size = 'small'
            tabBarGutter = {5}
            tabBarStyle = {{textAlign: 'center'}}
            onChange = {e => {
              this.setState({tab:e});
              if (e === 'eco') {
                this.updateEcoFormFields()
              } else if (e === 'max') {
                this.updateMaxFormFields(this.state.selectRoofIndex);
              }
            }}
          >
            <TabPane tab=<FormattedMessage id='manual_panel' /> key="manual">
              {panelAzimuth}
              {panelTilt}
              {panelOrientation}
              {rowSpacing}
              {colSpacing}
              {align}
            </TabPane>
            <TabPane
              tab={
                this.props.workingBuilding.type === 'FLAT' ?
                <FormattedMessage id='max_panels' /> :
                <FormattedMessage id='roofDirection' />
              }
              key="max"
            >
              <Spin
                spinning={this.state.isFetching}
                indicator={<Icon type="loading" spin />}
              >
                {panelAzimuth}
                {panelTilt}
                {panelOrientation}
                {rowSpacing}
                {colSpacing}
                {align}
              </Spin>
            </TabPane>
            <TabPane
              tab={
                this.props.projectInfo.globalOptimalTilt ?
                <FormattedMessage id='max_Econ' /> :
                <Tooltip
                  placement="topLeft"
                  title="Maximum Economy calculation is in progress. Please \
                  wait for a few minutes"
                >
                  Max Eco
                </Tooltip>
              }
              key="eco"
              disabled={!this.props.projectInfo.globalOptimalTilt}
            >
              {panelAzimuth}
              {panelTilt}
              {panelOrientation}
              {rowSpacing}
              {colSpacing}
              {align}
            </TabPane>
          </Tabs>

          <Divider />
          {mode}

          {
            this.state.mode === 'array' ?
            optionalRowPerArray :
            null
          }
          {
            this.state.mode === 'array' ?
            optionalPanelPerRow :
            null
          }

          {/*The button to validate & process to create a new building*/}
          <Row >
            <Col span={20} offset={2}>
              <ButtonGroup className='inputArea'>
                <Button
                  style={{width: '40%'}}
                  shape='round' size='large'
                  htmlType="submit" loading={this.props.backendLoading}
                  disabled={this.state.isFetching}
                >
                  <FormattedMessage id='preview_layout' />
                </Button>
                <Button
                  style={{width: '60%'}}
                  type='primary'
                  shape='round'
                  size='large'
                  disabled = {
                    Object.keys(this.props.panels).length === 0 ||
                    this.props.backendLoading ||
                    this.state.isFetching
                  }
                  onClick = {this.props.fetchUserInverters}
                >
                  <FormattedMessage id='continue_layout' /> <Icon type='right' />
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
    workingBuilding: state.buildingManagerReducer.workingBuilding,
    userPanels: state.undoableReducer.present.editingPVPanelManagerReducer.userPanels,
    roofSpecParams: state.undoableReducer.present.editingPVPanelManagerReducer
      .roofSpecParams,
    projectInfo: state.projectManagerReducer.projectInfo,
    panels: state.undoableReducer.present.editingPVPanelManagerReducer.panels
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUserInverters: () => dispatch(actions.fetchUserInverters()),
    setupPanelParams: (values, roofIndex) =>
      dispatch(actions.setupPanelParams(values, roofIndex)),
    generatePanels: (roofIndex) => dispatch(actions.generatePanels(roofIndex)),
    setDebugPolylines: (polylines) =>
      dispatch(actions.setDebugPolylines(polylines)),
    setDebugPoints: (points) => dispatch(actions.setDebugPoints(points)),
    setBackendLoadingTrue: () => dispatch(actions.setBackendLoadingTrue()),
    setBackendLoadingFalse: () => dispatch(actions.setBackendLoadingFalse())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Form.create({ name: 'setupPVPanel' })(SetUpPVPanel)));
