import React from 'react';
import { Entity } from 'resium';
import * as Cesium from 'cesium';


const CustomPolyline = (props) => {
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
        clampToGround : true,
        width: props.width,
        material: props.color
      }}
      show={props.show}
    />
  )
}

export default CustomPolyline;
