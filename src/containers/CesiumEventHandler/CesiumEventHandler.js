import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScreenSpaceEventHandler, ScreenSpaceEvent } from 'resium';
import * as Cesium from 'cesium';

import * as actions from '../../store/actions/index';

class CesiumEventHandlers extends Component {

  render () {
    return (
      <ScreenSpaceEventHandler>
         <ScreenSpaceEvent
            action={(event) => this.props.onAddPoint(
              event.position, this.props.viewer
            )}
            type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
          />
          <ScreenSpaceEvent
             action={(event) => {console.log('LEFT_CLICK + SHIFT')}}
             type={Cesium.ScreenSpaceEventType.LEFT_CLICK}
             modifier={Cesium.KeyboardEventModifier.SHIFT}
          />
          <ScreenSpaceEvent
             action={(event) => {console.log('RIGHT_CLICK')}}
             type={Cesium.ScreenSpaceEventType.RIGHT_CLICK}
           />
          <ScreenSpaceEvent
             action={(event) => {
               this.props.onDragPoint(event.endPosition, this.props.viewer)
             }}
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
    viewer: state.cesiumReducer.viewer
  };
}

const mapDispatchToProps = dispatch => {
  return {
        onAddPoint: (cartesian, viewer) => dispatch(
          actions.addPoint(cartesian, viewer)
        ),
        onDragPoint: (cartesian, viewer) => dispatch(
          actions.dragPoint(cartesian, viewer)
        )
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CesiumEventHandlers);
