import React from 'react';
import { Entity } from 'resium';
import * as Cesium from 'cesium';

const CustomPoint = (props) => {
  return (
    <Entity
      id={props.entityId}
      name={props.name}
      position={new Cesium.CallbackProperty(() => {
        return new Cesium.Cartesian3.fromDegrees(...props.getCoordinate(true));
      }, false)}
      point={{
        pixelSize: props.pixelSize,
        // color: props.color,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
      }}
      show={props.show}
    />
  )
}

export default CustomPoint;
