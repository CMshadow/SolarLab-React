import React from 'react';
import { connect } from 'react-redux';

import { ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../../../../store/actions/index';

const LeftClickHandler = (props) => {

  const leftClickActions = (event) => {
    if (props.uiState === 'DRAWING_FOUND') {
      props.disableRotate();
      props.addPointOnPolyline(event.position, props.viewer);
    } else if (props.uiState === 'DRAWING_INNER') {
      const PickedObjectsArray = props.viewer.scene.drillPick(event.position);
      props.disableRotate();
      props.addOrClickPoint(event.position, props.viewer, PickedObjectsArray);
      if (props.hoverPolyline) {
        props.releaseHoverPolyline();
      }
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
    uiState: state.undoableReducer.present.uiStateManagerReducer.uiState,
    hoverPolyline: state.undoableReducer.present.drawingManagerReducer.hoverPolyline,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    disableRotate: () => dispatch(actions.disableRotate()),
    releaseHoverPolyline: () => dispatch(actions.releaseHoverPolyline()),
    addPointOnPolyline: (cartesian, viewer) => dispatch(
      actions.addPointOnPolyline(cartesian, viewer)
    ),
    addOrClickPoint: (cartesian, viewer, pickedObject) => dispatch(
      actions.addOrClickPoint(cartesian, viewer, pickedObject)
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftClickHandler);
