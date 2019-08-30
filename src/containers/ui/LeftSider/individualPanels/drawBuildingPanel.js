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

    let text = null;
    if (this.props.uiState === 'READY_DRAWING') {
      text = 'Draw Building Outline';
    } else if (this.props.uiState === 'DRAWING_FOUND') {
      text = '...Drawing...';
    } else if (this.props.uiState === 'FOUND_DREW') {
      text = 'Finished'
    }

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
              loading={this.props.uiState === 'DRAWING_FOUND'}
              onClick={this.props.setUIStateDrawingFound}
            >
              {text}
            </Button>
          </Col>
        </Row>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUIStateDrawingFound: () => dispatch(actions.setUIStateDrawingFound())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawBuildingPanel);
