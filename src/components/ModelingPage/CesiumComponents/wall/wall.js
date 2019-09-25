import React from 'react';
import { Entity } from 'resium';
import * as Cesium from 'cesium';

const CustomWall = (props) => {
	return (
		<Entity
			id={props.entityId}
			name={props.name}
			wall={{
				positions: Cesium.Cartesian3.fromDegreesArray(props.positions),
        maximumHeights: props.maximumHeight,
        minimumHeights: props.minimumHeight,
				outline: false,
				material: props.material,
				shadows: Cesium.ShadowMode.ENABLED
			}}
			show={props.show}
		/>
	)
};

export default CustomWall;
