import React from 'react';
import { Button } from 'antd';
import { ActionCreators } from 'redux-undo';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

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
        ><FormattedMessage id='undo' /></Button>
        <Button
          style = {{position: "relative", left:'20px'}}
          type='default'
          icon='redo'
          onClick={props.onRedo}
          disabled={!props.canRedo}
        ><FormattedMessage id='redo' /></Button>

      </div>
  );
};

const mapStateToProps = state => {
  return {
    canUndo:
      state.undoable.past && state.undoable.past.length > 0,
    canRedo:
      state.undoable.future && state.undoable.future.length > 0
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
