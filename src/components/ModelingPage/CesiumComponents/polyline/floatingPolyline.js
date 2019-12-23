import React from 'react';
import { Entity } from 'resium';
import * as Cesium from 'cesium';

const FloatPolyline = (props) => {
  return (
    <Entity
      id={props.entityId}
      name={props.name}
      polyline={{
        positions: new Cesium.CallbackProperty(() => {
          return new Cesium.Cartesian3.fromDegreesArrayHeights(
            props.getPointsCoordinatesArray()
          );
        }, false),
        width: props.width,
        material: props.color
      }}
      show={props.show}
    />
  )
}

export default FloatPolyline;
