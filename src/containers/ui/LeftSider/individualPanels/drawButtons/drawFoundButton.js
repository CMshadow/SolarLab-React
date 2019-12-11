import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/pro-light-svg-icons'
import {
  Divider,
  Row,
  Col,
  Button,
} from 'antd';

import * as actions from '../../../../../store/actions/index';

const DrawFoundButton = (props) => {

  const drawButton = (
    <Button
      type='primary'
      size='large'
      shape='round'
      block
      onClick={props.setUIStateDrawingFound}
    >
      Draw Building Outline
    </Button>
  )

  const drawingButton = (
    <Button
      type='primary'
      size='large'
      shape='round'
      block
      loading={true}
    >
      ...Draw Outline on Map...
    </Button>
  )

  const editButton = (
    <Button
      type='default'
      size='large'
      shape='round'
      block
      disabled={props.uiState !== 'FOUND_DREW'}
      onClick={() => {
          props.disableRotate();
          props.setUIStateEditingFound();
        }
      }
    >
      Click to Edit Outline
    </Button>
  )

  const editingButton = (
    <Button
      type='danger'
      size='large'
      shape='round'
      block
      onClick={() => {
          props.enableRotate();
          props.setUIStateFoundDrew();
        }
      }
    >
      Click to Stop Editing
    </Button>
  )

  return (
    <Row>
      <Col span={18} offset={3}>
        {props.uiState === 'READY_DRAWING' ? drawButton : null}
        {props.uiState === 'DRAWING_FOUND' ? drawingButton : null}
        {
          props.uiState !== 'READY_DRAWING' &&
          props.uiState !== 'DRAWING_FOUND' &&
          props.uiState !== 'EDITING_FOUND' ?
          editButton : null
        }
        {props.uiState === 'EDITING_FOUND' ? editingButton : null}
      </Col>
    </Row>
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(DrawFoundButton);
