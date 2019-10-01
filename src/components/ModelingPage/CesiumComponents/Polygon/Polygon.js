import React from 'react';
import { Entity } from 'resium';
import * as Cesium from 'cesium';


/* 
    Polygon: Create Basic 3D-foundations of both Flat/Pitched Roof
*/

const polygonVisualize = (props) => {
	return (
		<Entity
			id={props.id}
			name={props.name}
			polygon={{
				hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(props.hierarchy),
				perPositionHeight: props.perPositionHeight,
				extrudedHeight: props.extrudedHeight,
				outline: true,
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
// function generate_pitched_roof_by_arrayheight(the_array){
//   var roof = viewer.entities.add({
//      name : 'Roof',
//      polygon : {
//        hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(the_array),
//        perPositionHeight : true,
//        //extrudedHeight : 0.0,
//        outline : true,
//        outlineColor : Cesium.Color.BLACK,
//        outlineWidth : 4,
//        material : Cesium.Color.fromAlpha(Cesium.Color.WHITE, 1),
//        shadows : Cesium.ShadowMode.ENABLED
//      }
//    });
//    return roof.id;
// }