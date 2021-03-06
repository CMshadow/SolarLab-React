import React from 'react';
import { Entity } from 'resium';
import * as Cesium from 'cesium';



/*
    Polygon: Create Basic 3D Polygon
*/

const polygonVisualize = (props) => {
	return (
		<Entity
			id={props.entityId}
			name={props.name}
			polygon={{
				hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(props.hierarchy),
				perPositionHeight: props.perPositionHeight,
				extrudedHeight: props.extrudedHeight,
				outline: props.name === 'roofPlane' ? true : false,
				outlineColor: props.outlineColor,
				outlineWidth: props.outlineWidth,
				material: props.material,
				shadows: Cesium.ShadowMode.ENABLED
			}}
			show={props.show}
		/>
	)
};

export default polygonVisualize;
