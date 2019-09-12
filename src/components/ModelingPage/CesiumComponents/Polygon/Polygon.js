import React from 'react';
import { Entity } from 'resium';
import * as Cesium from 'cesium';

/* 
    Polygon: Create Basic 3D-foundations of both Flat/Pitched Roof
*/


const polygonVisualize = (props) => {
    console.log("hahhahahaha: "+ props.id + ' ' + props.show );
    return (
        <Entity 
            id = {props.id}
            name = {props.name}
            polygon={{
                hierarchy: new Cesium.Cartesian3.fromDegreesArrayHeights(props.hierarchy),
                perPositionHeight: props.perPositionHeight,
                extrudedHeight: props.extrudedHeight,
                material: props.material,
                shadows: Cesium.ShadowMode.ENABLED//props.shadowsEnable
            }}
            show={props.show}
        />
    )
};

export default polygonVisualize;
