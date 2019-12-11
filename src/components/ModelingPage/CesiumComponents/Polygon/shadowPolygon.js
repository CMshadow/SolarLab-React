import React from 'react';
import { Entity } from 'resium';
import * as Cesium from 'cesium';

const ShadowPolygon = (props) => {
	return (
		<Entity
			id={props.entityId}
			name={props.name}
			polygon={{
				hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(props.hierarchy),
				perPositionHeight: props.perPositionHeight,
				outline: false,
				outlineColor: props.outlineColor,
				outlineWidth: props.outlineWidth,
				material: props.material,
				shadows: Cesium.ShadowMode.ENABLED
			}}
			show={props.show}
		/>
	)
};

export default ShadowPolygon;
