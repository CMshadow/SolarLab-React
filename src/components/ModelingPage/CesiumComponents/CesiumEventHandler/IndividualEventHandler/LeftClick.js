import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const LeftClickHandler = (props) => {

  const leftClickActions = (event) => {
    if (props.uiStartDrawing) {
      props.disableRotate();
      props.addPointOnPolyline(event.position, props.viewer);
    }
  };

  return (
    <ScreenSpaceEvent
      action={(event) => leftClickActions(event)}
      type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
    />
  );
};

const mapStateToProps = state => {
  return {
    viewer: state.cesiumReducer.viewer,
    uiStartDrawing: state.undoableReducer.present.uiStateManagerReducer.uiStartDrawing,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    disableRotate: () => dispatch(actions.disableRotate()),
    addPointOnPolyline: (cartesian, viewer) => dispatch(
      actions.addPointOnPolyline(cartesian, viewer)
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftClickHandler);
