import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';

import * as actions from '../../../../../store/actions/index';

class KeyPressHandler extends Component {

  state = {
    moveForward : false,
    moveBackward : false,
    moveUp : false,
    moveDown : false,
    moveLeft : false,
    moveRight : false
  }

  moveCamera = () => {
    const ellipsoid = this.props.viewer.scene.globe.ellipsoid;
    const camera = this.props.viewer.camera;
    const cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / 3000.0;
    if (this.state.moveUp) camera.moveUp(moveRate);
    if (this.state.moveDown) camera.moveDown(moveRate);
    if (this.state.moveLeft) camera.moveLeft(moveRate);
    if (this.state.moveRight) camera.moveRight(moveRate);
    if (this.state.moveForward) camera.moveForward(moveRate);
    if (this.state.moveBackward) camera.moveBackward(moveRate);
  }

  recordKeyDownEvent = (event) => {
    switch (event.keyCode) {
      case 27:
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
        return;

      case 'W'.charCodeAt(0):
        return this.setState({moveUp: true});
      case 'S'.charCodeAt(0):
        return this.setState({moveDown: true});
      case 'A'.charCodeAt(0):
        return this.setState({moveLeft: true});
      case 'D'.charCodeAt(0):
        return this.setState({moveRight: true});
      case 'Q'.charCodeAt(0):
        return this.setState({moveForward: true});
      case 'E'.charCodeAt(0):
        return this.setState({moveBackward: true});
      default:
        return;
    }
  }

  recordKeyUpFunction = (event) => {
    switch (event.keyCode) {
      case 'W'.charCodeAt(0):
        return this.setState({moveUp: false});
      case 'S'.charCodeAt(0):
        return this.setState({moveDown: false});
      case 'A'.charCodeAt(0):
        return this.setState({moveLeft: false});
      case 'D'.charCodeAt(0):
        return this.setState({moveRight: false});
      case 'Q'.charCodeAt(0):
        return this.setState({moveForward: false});
      case 'E'.charCodeAt(0):
        return this.setState({moveBackward: false});
      default:
        return;
    }
  }

  componentDidMount = () => {
    document.addEventListener("keydown", e => this.recordKeyDownEvent(e));
    document.addEventListener("keyup", e => this.recordKeyUpFunction(e));
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", e => this.recordKeyDownEvent(e));
    document.addEventListener("keyup", e => this.recordKeyUpFunction(e));
  };

  render () {
    this.props.viewer.clock.onTick.addEventListener(clock => this.moveCamera());
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
    viewer: state.cesiumReducer.viewer,
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
