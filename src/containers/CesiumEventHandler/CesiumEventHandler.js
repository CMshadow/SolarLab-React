import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScreenSpaceEventHandler, ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../store/actions/index';

class CesiumEventHandlers extends Component {

  leftClickActions = (event) => {
    if (this.props.uiStartDrawing) {
      this.props.disableRotate();
      this.props.onAddPointOnPolyline(
        event.position, this.props.viewer
      );
    }
  };

  leftDownActions = (event) => {
    // if (this.props.uiStartDrawing) {
    //   this.props.disableRotate();
    //   this.props.onAddPointOnPolyline(
    //     event.position, this.props.viewer
    //   );
    // }
  };

  rightClickActions = (event) => {
    this.props.onTerminateDrawing();
    this.props.enableRotate();
    this.props.setStopDrawing();
  };

  mouseMoveActions = (event) => {
    if (this.props.uiStartDrawing) {
      this.props.onDragPolyline(event.endPosition, this.props.viewer);
    } else {
      if (this.props.viewer.scene.pick(event.endPosition)) {
        const onTopPoint  = this.props.fixedPoints.find(element => {
          return element.entityId === this.props.viewer.scene.pick(event.endPosition).id.id
        })
        if (onTopPoint) this.props.setHoverPoint(onTopPoint);
      } else {
        if (this.props.hoverPoint) this.props.releaseHoverPoint();
      }
    }
  };

  render () {
    return (
      <ScreenSpaceEventHandler>
         <ScreenSpaceEvent
            action={(event) => this.leftClickActions(event)}
            type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
          />
          <ScreenSpaceEvent
             action={(event) => this.leftDownActions(event)}
             type={Cesium.ScreenSpaceEventType.LEFT_DOWN}
           />
          <ScreenSpaceEvent
             action={(event) => {console.log('LEFT_CLICK + SHIFT')}}
             type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
             modifier={Cesium.KeyboardEventModifier.SHIFT}
          />
          <ScreenSpaceEvent
             action={(event) => this.rightClickActions(event)}
             type={Cesium.ScreenSpaceEventType.RIGHT_CLICK}
           />
          <ScreenSpaceEvent
             action={(event) => this.mouseMoveActions(event)}
             type={Cesium.ScreenSpaceEventType.MOUSE_MOVE}
          />
          <ScreenSpaceEvent
             action={(event) => {console.log('MOUSE_MOVE + SHIFT')}}
             type={Cesium.ScreenSpaceEventType.MOUSE_MOVE}
             modifier={Cesium.KeyboardEventModifier.SHIFT}
          />
      </ScreenSpaceEventHandler>
    );
  }
}

const mapStateToProps = state => {
  return {
    viewer: state.cesiumReducer.viewer,
    uiStartDrawing: state.uiStateManagerReducer.uiStartDrawing,
    fixedPoints: state.drawingManagerReducer.fixedPoints,
    hoverPoint: state.drawingManagerReducer.hoverPoint,
  };
};

const mapDispatchToProps = dispatch => {
  return {
        onDragPolyline: (cartesian, viewer) => dispatch(
          actions.dragPolyline(cartesian, viewer)
        ),
        onAddPointOnPolyline: (cartesian, viewer) => dispatch(
          actions.addPointOnPolyline(cartesian, viewer)
        ),
        onTerminateDrawing: () => dispatch(
          actions.terminateDrawing()
        ),
        setStopDrawing: () => dispatch(
          actions.stopDrawing()
        ),
        enableRotate: () => dispatch(actions.enableRotate()),
        disableRotate: () => dispatch(actions.disableRotate()),
        setHoverPoint: (point) => dispatch(actions.setHoverPoint(point)),
        releaseHoverPoint: () => dispatch(actions.releaseHoverPoint()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CesiumEventHandlers);
