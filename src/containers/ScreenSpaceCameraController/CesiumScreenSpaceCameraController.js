import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScreenSpaceCameraController } from 'resium';

class CesiumScreenSpaceCameraController extends Component {
  render () {
    return (
      <ScreenSpaceCameraController
        enableRotate={this.props.enableRotate}
        enableLook={false}
      />
    );
  };
}

const mapStateToProps = state => {
  return {
    enableRotate: state.cesiumReducer.enableRotate,
  };
};

export default connect(mapStateToProps)(CesiumScreenSpaceCameraController);
