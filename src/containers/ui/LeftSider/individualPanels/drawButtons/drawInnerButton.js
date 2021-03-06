import React from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Col,
  Button,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';


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
      <FormattedMessage id='drawinnerlines' />
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
            props.intl.formatMessage({id:'ErrorInnerDrawing'}),
            props.intl.formatMessage({id:'ErrorInnerLineType'})
          )
        }
      }}
    >
      <FormattedMessage id='clicktofinishInnerline' />
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
      <FormattedMessage id='editInnerLines' />
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
    uiState:
      state.undoable.present.uiStateManager.uiState,
    drawingInnerPolyline:
      state.undoable.present.drawingInnerManager.drawingInnerPolyline,
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(DrawInnerButton));
