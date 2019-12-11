import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/pro-light-svg-icons'
import {
  Row,
  Col,
  Button,
} from 'antd';

import * as uiStateJudge from '../../../../../infrastructure/ui/uiStateJudge';
import * as actions from '../../../../../store/actions/index';
import ErrorNotification from '../../../../../components/ui/Notification/ErrorNotification';

const DrawInnerButton = (props) => {

  const drawButton = (
    <Button
      type='primary'
      size='large'
      shape='round'
      block
      disabled={props.uiState !== 'FOUND_DREW'}
      onClick={() => {
        props.passFoundPolyline();
        props.setUIStateDrawingInner();
      }}
    >
      Draw Inner Lines
    </Button>
  )

  const drawingButton = (
    <Button
      type='danger'
      size='large'
      shape='round'
      block
      loading={props.drawingInnerPolyline}
      onClick={() => {
        if (props.checkInnerTypesProvided()) {
          props.updatePointsRelation();
          props.setUIStateInnerDrew();
          props.enableRotate();
        } else {
          ErrorNotification(
            'Drawing Error', 'Please right click inner lines to provide types'
          )
        }
      }}
    >
      ...Click to Finish...
    </Button>
  )

  const editButton = (
    <Button
      type='default'
      size='large'
      shape='round'
      block
      onClick={() => {
        props.setUIStateDrawingInner();
      }}
    >
      Edit Inner Lines
    </Button>
  )

  return (
    <Row>
      <Col span={18} offset={3}>
        {uiStateJudge.showDrawInner(props.uiState) ? drawButton : null}
        {props.uiState === 'DRAWING_INNER' ? drawingButton : null}
        {props.uiState === 'INNER_DREW' ? editButton : null}
      </Col>
    </Row>
  );
};

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    drawingInnerPolyline:
      state.undoableReducer.present.drawingInnerManagerReducer
      .drawingInnerPolyline,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enableRotate: () => dispatch(actions.enableRotate()),
    disableRotate: () => dispatch(actions.disableRotate()),
    passFoundPolyline: () => dispatch(actions.passFoundPolyline()),
    updatePointsRelation: () => dispatch(actions.updatePointsRelation()),
    setUIStateDrawingInner: () => dispatch(actions.setUIStateDrawingInner()),
    setUIStateInnerDrew: () => dispatch(actions.setUIStateInnerDrew()),
    checkInnerTypesProvided: () => dispatch(actions.checkInnerTypesProvided()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawInnerButton);
