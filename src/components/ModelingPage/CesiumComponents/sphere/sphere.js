import React from 'react';
import { Entity } from 'resium';
import * as Cesium from 'cesium';

const customSphere = (props) => {
	return (
		<Entity
			id={props.entityId}
			name={props.name}
      position={new Cesium.CallbackProperty(() => {
        return new Cesium.Cartesian3.fromDegrees(
          ...props.centerPoint.getCoordinate(true)
        );
      }, false)}
      ellipsoid={{
        radii : new Cesium.Cartesian3(props.radius, props.radius, props.radius),
        material : props.material,
      }}
			show={props.show}
		/>
	)
};

export default customSphere;
