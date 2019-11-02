import React from 'react';
import { Entity } from 'resium';
import * as Cesium from 'cesium';

const CustomCylinder = (props) => {
	return (
		<Entity
			id={props.entityId}
			name={props.name}
      position={new Cesium.CallbackProperty(() => {
        return new Cesium.Cartesian3.fromDegrees(
          props.centerPoint.lon, props.centerPoint.lat, props.centerPoint.height/2
        );
      }, false)}
      cylinder = {{
        length : props.centerPoint.height,
        topRadius : props.radius/10,
        bottomRadius : props.radius/10,
        material : Cesium.Color.SADDLEBROWN
      }}
			show={props.show}
		/>
	)
};

export default CustomCylinder;
