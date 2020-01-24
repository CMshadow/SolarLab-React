import React from 'react';
import { connect } from 'react-redux';
import { ScreenSpaceCameraController } from 'resium';

const CesiumScreenSpaceCameraController = (props) => {
  return (
    <ScreenSpaceCameraController
      enableRotate={props.enableRotate}
      enableLook={false}
    />
  );
}

const mapStateToProps = state => {
  return {
    enableRotate:
      state.undoable.presentcesiumManager.enableRotate,
  };
};

export default connect(mapStateToProps)(CesiumScreenSpaceCameraController);
