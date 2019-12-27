import React from 'react';
import { connect } from 'react-redux';
import { Viewer } from 'resium';
import * as Cesium from 'cesium';

import { BING_MAP_KEY } from '../../../../accessToken';
import * as actions from '../../../../store/actions/index';

const CustomViewer = (props) => {
  const worldTerrain = Cesium.createWorldTerrain();

  const bingMap = new Cesium.BingMapsImageryProvider({
    url: 'https://dev.virtualearth.net',
    key: BING_MAP_KEY,
    mapStyle: Cesium.BingMapsStyle.AERIAL
  });

  return (
    <Viewer
      ref={ref => { if (!props.viewer && ref) props.onSetViewer(ref.cesiumElement)}}
      style={{position: "absolute", top: 50, left: 0, right: 0, bottom: 0}}
      terrainProvider={props.enableTerrain ? worldTerrain : null}
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
      {props.children}
    </Viewer>
  );
};

const mapStateToProps = state => {
  return{
    viewer: state.cesiumReducer.viewer
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetViewer: (viewer) => dispatch(actions.setViewer(viewer)),
  };
}

export default connect(null, mapDispatchToProps)(CustomViewer);
