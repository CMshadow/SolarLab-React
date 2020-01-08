import React from 'react';
import { connect } from 'react-redux';
import { Viewer, ImageryLayer } from 'resium';
import * as Cesium from 'cesium';

import { BING_MAP_KEY } from '../../../../accessToken';
import * as actions from '../../../../store/actions/index';

const bingMap = new Cesium.BingMapsImageryProvider({
  url: 'https://dev.virtualearth.net',
  key: BING_MAP_KEY,
  mapStyle: Cesium.BingMapsStyle.AERIAL
});

const aMap = new Cesium.UrlTemplateImageryProvider({
  url: 'https://webst01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6',
  maximumLevel: 18
});

const googleMap = new Cesium.UrlTemplateImageryProvider({
  url: 'https://mt{s}.google.cn/vt/?lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}',
  subdomains: ['1', '2', '3'],
  maximumLevel: 20
});

const CustomViewer = (props) => {
  const worldTerrain = Cesium.createWorldTerrain();
  return (
    <Viewer
      ref={ref => {
        if (ref && ref.cesiumElement) {
          console.log(ref.cesiumElement)
          props.onSetViewer(ref.cesiumElement)
        }
      }}
      style={{position: "absolute", top: 64, left: 0, right: 0, bottom: 0}}
      terrainProvider={props.enableTerrain ? worldTerrain : null}
      imageryProvider={googleMap}
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
      {
        props.selectedMap === 'bing' ?
        <ImageryLayer imageryProvider={bingMap}/> : null
      }
      {
        props.selectedMap === 'aMap' ?
        <ImageryLayer imageryProvider={aMap}/> : null
      }
      {props.children}
    </Viewer>
  );
};

const mapStateToProps = state => {
  return{
    selectedMap: state.cesiumReducer.selectedMap
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetViewer: (viewer) => dispatch(actions.setViewer(viewer)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomViewer);
