import React from 'react';
import { Entity } from 'resium';
import * as Cesium from 'cesium';

/* 
    Polygon: Create Basic 3D-foundations of both Flat/Pitched Roof
*/


const polygonVisualize = (props) => {
    console.log("hahhahahaha "+ props.id + ' ' + props.name );
    return (
        <Entity 
            id = {'1235566'}
            name = {'props.name'}
            polygon={{
                hierarchy: new Cesium.Cartesian3.fromDegreesArrayHeights([-117.841128138803,33.647271736676,5,-117.841312393538,33.646929442767,5,-117.841042636422,33.646859019268,5,-117.840945037791,33.647098452844,5],
                    ),
                perPositionHeight: true,
                extrudedHeight: 0.0,
                material: Cesium.Color.WHITE,
                shadows: Cesium.ShadowMode.ENABLED//props.shadowsEnable
            }}
            show={props.show}
        />
    )
};

export default polygonVisualize;


// function generate_flat_roof_setback_building_by_arrayheight(the_array, custom_id=undefined){
//     var roof = viewer.entities.add({
//       id: custom_id,
//       name : 'Building-Roof-Setback',
//       polygon : {
//         hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(the_array),
//         perPositionHeight : true,
//         extrudedHeight : 0.0,
//         material : Cesium.Color.fromAlpha(Cesium.Color.ORANGE, 1),
//         shadows : Cesium.ShadowMode.ENABLED
//       }
//     });
//     return roof.id
//   }