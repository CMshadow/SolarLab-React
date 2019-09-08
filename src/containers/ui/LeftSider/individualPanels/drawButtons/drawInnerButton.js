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
      onClick={() => {
        props.setUIStateInnerDrew();
        props.enableRotate();
        console.log(props.test)
        console.log(props.test2)
      }}
    >
      ...Drawing...
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
    test: state.undoableReducer.present.drawingInnerManagerReducer.pointsRelation,
    test2: state.undoableReducer.present.drawingManagerReducer.drawingPolyline
  };
};

const mapDispatchToProps = dispatch => {
  return {
    enableRotate: () => dispatch(actions.enableRotate()),
    disableRotate: () => dispatch(actions.disableRotate()),
    passFoundPolyline: () => dispatch(actions.passFoundPolyline()),
    setUIStateDrawingInner: () => dispatch(actions.setUIStateDrawingInner()),
    setUIStateInnerDrew: () => dispatch(actions.setUIStateInnerDrew()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawInnerButton);
