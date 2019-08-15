import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Viewer } from 'resium';
import * as Cesium from 'cesium';

import { BING_MAP_KEY, ION_TOKEN } from '../../accessToken';
import * as actions from '../../store/actions/index';

class CustomViewer extends Component {

  render () {
    Cesium.Ion.defaultAccessToken = ION_TOKEN;

    const worldTerrain = Cesium.createWorldTerrain();

    const bingMap = Cesium.BingMapsImageryProvider({
      url: 'https://dev.virtualearth.net',
      key: BING_MAP_KEY,
      mapStyle: Cesium.BingMapsStyle.AERIAL_WITH_LABELS
    });

    return (
      <Viewer
        ref={ref => this.props.onSetViewer(ref.cesiumElement)}
        style={{position: "absolute", top: 50, left: 0, right: 0, bottom: 0}}
        terrainProvider={this.props.enableTerrain ? worldTerrain : null}
        imageryProvider={bingMap}
        geocoder={false}
        fullscreenButton={false}
        vrButton={false}
        infoBox={false}
        sceneModePicker={false}
        homeButton={false}
        navigationHelpButton={false}
        baseLayerPicker={false}
        animation={false}
        timeline={false}
        shadows={false}
        sceneMode={Cesium.SceneMode.SCENE3D}
      >
        {this.props.children}
      </Viewer>
    )
  }

}

const mapDispatchToProps = dispatch => {
  return {
    onSetViewer: (viewer) => dispatch(actions.setViewer(viewer)),
  };
}

export default connect(null, mapDispatchToProps)(CustomViewer);
