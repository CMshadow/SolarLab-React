import React from 'react';
import {
  Row,
  Col,
  Button } from 'antd';
import { ActionCreators } from 'redux-undo';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

const UndoRedo = (props) => {
  return (
      <div style = {{margin: "0 auto", position: "relative",top: "12px"}}>
        <Button
          style = {{position: "relative", right:'20px'}}
          type='default'
          icon='undo'
          onClick={() => {
            props.onUndo();
          }}
          disabled={!props.canUndo}
        >Undo</Button>
        <Button
          style = {{position: "relative", left:'20px'}}
          type='default'
          icon='redo'
          onClick={props.onRedo}
          disabled={!props.canRedo}
        >Redo</Button>
      </div>
  );
};

const mapStateToProps = state => {
  return {
    canUndo: state.undoableReducer.past && state.undoableReducer.past.length > 0,
    canRedo: state.undoableReducer.future && state.undoableReducer.future.length > 0
  };
};

const mapDispatchToProps = dispatch => {
  return {
    cleanHoverAndColor: () => dispatch(actions.cleanHoverAndColor()),
    onUndo: () => dispatch(ActionCreators.undo()),
    onRedo: () => dispatch(ActionCreators.redo())
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(UndoRedo);
