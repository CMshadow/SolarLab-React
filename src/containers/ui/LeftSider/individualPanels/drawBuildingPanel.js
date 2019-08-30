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

    let drawButtonText = null;
    if (this.props.uiState === 'READY_DRAWING') {
      drawButtonText = 'Draw Building Outline';
    } else if (this.props.uiState === 'DRAWING_FOUND') {
      drawButtonText = '...Drawing...';
    }

    const drawButton = (
      <Button
        type="primary"
        size="large"
        shape='round'
        block
        loading={this.props.uiState === 'DRAWING_FOUND'}
        onClick={this.props.setUIStateDrawingFound}
      >
        {drawButtonText}
      </Button>
    )

    let editButtonText = null;
    if (this.props.uiState === 'FOUND_DREW') {
      editButtonText = 'Edit Outline';
    } else if (this.props.uiState === 'EDITING_FOUND') {
      editButtonText = 'Click to Stop Editing';
    }

    const editButton = (
      <Button
        type={this.props.uiState === 'EDITING_FOUND' ? 'danger' : "default"}
        size="large"
        shape='round'
        block
        onClick={
          this.props.uiState === 'EDITING_FOUND' ?
          () => {
            this.props.enableRotate();
            this.props.setUIStateFoundDrew();
          } : () => {
            this.props.disableRotate();
            this.props.setUIStateEditingFound();
          }
        }
      >
        {editButtonText}
      </Button>
    )

    return (
      <div>
        <Divider>Step 1</Divider>
        <Row>
          <Col span={18} offset={3}>
            {
              this.props.uiState === 'READY_DRAWING' ||
              this.props.uiState === 'DRAWING_FOUND' ?
              drawButton : null
            }
            {
              this.props.uiState === 'FOUND_DREW' ||
              this.props.uiState === 'EDITING_FOUND' ?
              editButton : null
            }
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
    enableRotate: () => dispatch(actions.enableRotate()),
    disableRotate: () => dispatch(actions.disableRotate()),
    setUIStateDrawingFound: () => dispatch(actions.setUIStateDrawingFound()),
    setUIStateFoundDrew: () => dispatch(actions.setUIStateFoundDrew()),
    setUIStateEditingFound: () => dispatch(actions.setUIStateEditingFound())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawBuildingPanel);
