import React, {Component} from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/pro-light-svg-icons'
import {
  Form,
  Input,
  InputNumber,
  Divider,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
} from 'antd';

import * as actions from '../../../../store/actions/index';

const { Option } = Select;

class DrawBuildingPanel extends Component {

  render () {
    return (
      <div>
        <Divider>Step 1</Divider>
        <Row>
          <Col span={18} offset={3}>
            <Button
              type="primary"
              size="large"
              shape='round'
              block
              loading={this.props.uiStartDrawing}
              onClick={this.props.setStartDrawing}
            >
              {this.props.uiStartDrawing ?
                null :
                <FontAwesomeIcon icon={faPen} />}
              {this.props.uiStartDrawing ?
                'Drawing...' :
                'Draw building outline'}
            </Button>
          </Col>
        </Row>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    uiStartDrawing: state.uiStateManagerReducer.uiStartDrawing
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setStartDrawing: () => dispatch(actions.startDrawing())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawBuildingPanel);
