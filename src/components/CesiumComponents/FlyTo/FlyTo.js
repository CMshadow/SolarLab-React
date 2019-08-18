import React from 'react';
import { CameraFlyTo } from 'resium';
import * as Cesium from 'cesium';

const FlyTo = (props) => {
  return (
    <CameraFlyTo
      destination={
        Cesium.Cartesian3.fromDegrees(...props.flyTo)
      }
    />
  )
}

export default FlyTo;
