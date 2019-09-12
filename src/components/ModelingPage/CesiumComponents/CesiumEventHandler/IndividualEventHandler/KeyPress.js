import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import * as actions from '../../../../../store/actions/index';

class KeyPressHandler extends Component {

  escFunction = (event) => {
    if(event.keyCode === 27) {
      switch (this.props.uiState) {
        case 'DRAWING_FOUND':
          this.props.exitCurrentDrawing();
          this.props.setUIStateReadyDrawing();
          break;

        case 'DRAWING_INNER':
          if (this.props.drawingInnerPolyline) {
            this.props.undo();
          }
          break;

        default:
          break;
      }
    }
  }

  componentDidMount = () => {
    document.addEventListener("keydown", this.escFunction);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.escFunction);
  };

  render () {
    return (
      <div>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    drawingInnerPolyline: state.undoableReducer.present.drawingInnerManagerReducer.drawingInnerPolyline,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    undo: () => dispatch(ActionCreators.undo()),
    exitCurrentDrawing: () => dispatch(actions.exitCurrentDrawing()),
    setUIStateReadyDrawing: () => dispatch(actions.setUIStateReadyDrawing())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeyPressHandler);
