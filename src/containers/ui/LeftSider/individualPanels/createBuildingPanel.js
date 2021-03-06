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
import { injectIntl, FormattedMessage } from 'react-intl';

import './FormInputArea.css';
import * as actions from '../../../../store/actions/index';

const { Option } = Select;

class CreateBuildingPanel extends PureComponent {
  state = {
    mode: this.props.buildingInfoFields.mode,
    type: this.props.buildingInfoFields.type
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.initBuilding(values);
        this.props.setUIStateReadyDrawing();
      }
    });
  };

  componentWillUnmount = () => {
    this.props.saveBuildingInfoFields(this.props.form.getFieldsValue());
  };

  numberInputRules = [{
    type: 'number',
    message: <FormattedMessage id='errMes_valid_buildingName' />
  },{
    required: true,
    message: 'Cannot be empty'
  }];
  rowLayout = {label: {span: 12, offset: 2}, field: {span: 8}};

  render () {
    const { getFieldDecorator } = this.props.form;
    const {intl} = this.props;

    const optionalFoundHtInput = (
      <Form.Item>
        <Row>
          <Col {...this.rowLayout.label}>
            <Tooltip
              placement="topLeft"
              title= {intl.formatMessage({id:'hint_foundationHeight'})}
            >
              <h4>
                <FormattedMessage id='buildingHeight' />
                <Icon type="question-circle" />
              </h4>
            </Tooltip>
          </Col>
          <Col {...this.rowLayout.field}>
            {getFieldDecorator('foundHt', {
              rules: [...this.numberInputRules],
              initialValue: this.props.buildingInfoFields.foundHt
            })(
              <InputNumber
                className='inputArea'
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
              title= {intl.formatMessage({id:'hint_parpet'})}
            >
              <h4>
                <FormattedMessage id='parapetHeight' />
                <Icon type="question-circle" />
              </h4>
            </Tooltip>
          </Col>
          <Col {...this.rowLayout.field}>
            {getFieldDecorator('parapetHt', {
              rules: [...this.numberInputRules],
              initialValue: this.props.buildingInfoFields.parapetHt
            })(
              <InputNumber
                className='inputArea'
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
              title= {intl.formatMessage({id:'hint_hip'})}
            >
              <h4>
                <FormattedMessage id='hipSetback' />
                <Icon type="question-circle" />
              </h4>
            </Tooltip>
          </Col>
          <Col {...this.rowLayout.field}>
            {getFieldDecorator('hipStb', {
              rules: [...this.numberInputRules],
              initialValue: this.props.buildingInfoFields.hipStb
            })(
              <InputNumber
                className='inputArea'
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
              title= {intl.formatMessage({id:'hint_ridge'})}
            >
              <h4>
                <FormattedMessage id='ridgeSetback' />
                <Icon type="question-circle" />
              </h4>
            </Tooltip>
          </Col>
          <Col {...this.rowLayout.field}>
            {getFieldDecorator('ridgeStb', {
              rules: [...this.numberInputRules],
              initialValue: this.props.buildingInfoFields.ridgeStb
            })(
              <InputNumber
                className='inputArea'
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
      <div style={{padding: '10px 10px 20px', overflow: 'auto'}}>
        <Row>
          <Col span={20} offset={2}>
            <Button shape='circle' icon='arrow-left'
              onClick={this.props.setUIStateIdel}
            />
          </Col>
        </Row>
        <Divider style={{margin: '10px 0px'}}/>
        <Form onSubmit={this.handleSubmit}>
          {/*Bulding name Input*/}
          <Form.Item>
            <Row>
              <Col span={20} offset={2}>
                <h3> <FormattedMessage id='buildingName'/> </h3>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={2}>
                {getFieldDecorator('name', {
                  initialValue: this.props.buildingInfoFields.name,
                  rules: [{
                    required: true,
                    message: <FormattedMessage id='errMes_buildingName' />
                  }],})(
                    <Input
                      placeholder= {intl.formatMessage({id:'yourBuildingName'})}
                      allowClear
                      autoComplete="off"
                    />
                  )
                }
              </Col>
            </Row>
          </Form.Item>

          {/*Bulding type Select*/}
          <Form.Item>
            <Row>
              <Col span={10} offset={2}>
                <h4> <FormattedMessage id='buildingType' /> </h4>
              </Col>
              <Col span={10}>
                {getFieldDecorator('type', {
                  initialValue: this.props.buildingInfoFields.type
                })(
                  <Select
                    className='inputArea'
                    onChange={(value,option) => {
                      this.setState({type:value});
                    }}>
                    <Option value='FLAT'>
                      <FormattedMessage id='flatRoof' />
                    </Option>
                    <Option value='PITCHED' disabled>
                      <FormattedMessage id='pitchedRoof' />
                    </Option>
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
                <h3><FormattedMessage id='workingon' /></h3>
              </Col>
            </Row>
            <Row>
              <Col span={20} offset={2} style={{textAlign: 'center'}}>
                {getFieldDecorator('mode', {
                  initialValue: this.state.mode
                })(
                  <Radio.Group
                    onChange={event => {
                      this.setState({mode: event.target.value});
                    }}
                    buttonStyle='solid'
                  >
                    <Radio.Button value="2D">
                      <FormattedMessage id='satelliteMap' />
                    </Radio.Button>
                    <Radio.Button value="3D">
                      <FormattedMessage id='drone3DMap' />
                    </Radio.Button>
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
                  title= {intl.formatMessage({id:'hint_eave'})}
                >
                  <h4>
                    <FormattedMessage id='eaveSetback' />
                    <Icon type="question-circle" />
                  </h4>
                </Tooltip>
              </Col>
              <Col {...this.rowLayout.field}>
                {getFieldDecorator('eaveStb', {
                  rules: [...this.numberInputRules],
                  initialValue: this.props.buildingInfoFields.eaveStb
                })(
                  <InputNumber
                    className='inputArea'
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
                <FormattedMessage id='createAbuilding' />
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
    buildingInfoFields:
      state.undoable.present.buildingManager.buildingInfoFields
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUIStateReadyDrawing: () => dispatch(actions.setUIStateReadyDrawing()),
    setUIStateIdel: () => dispatch(actions.setUIStateIdel()),
    initBuilding: (values) => dispatch(actions.initBuilding(values)),
    saveBuildingInfoFields: (values) => dispatch(
      actions.saveBuildingInfoFields(values)
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Form.create({ name: 'createBuilding' })(CreateBuildingPanel)));
