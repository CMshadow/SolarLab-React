import React from 'react';
import {
  Row,
  Col,
  Button } from 'antd';
import { ActionCreators } from 'redux-undo';
import { connect } from 'react-redux';

const UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => {
  return (
    <Row>
      <Col span={10} offset={2}>
        <Button
          type='default'
          icon='undo'
          onClick={onUndo}
          disabled={!canUndo}
        >Undo</Button>
      </Col>
      <Col span={10}>
        <Button
          type='default'
          icon='redo'
          onClick={onRedo}
          disabled={!canRedo}
        >Redo</Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = state => {
  return {
    canUndo: state.undoableReducer.past.length > 0,
    canRedo: state.undoableReducer.future.length > 0
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUndo: () => dispatch(ActionCreators.undo()),
    onRedo: () => dispatch(ActionCreators.redo())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(UndoRedo);
