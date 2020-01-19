import React from 'react';
import uuid from 'uuid/v1';
import * as turf from '@turf/turf';
import { Entity } from 'resium';
import * as Cesium from 'cesium';
import Coordinate from '../../../../infrastructure/point/coordinate';

const PolygonLabel = (props) => {
    const htOffset = 0.5;
    const centroid =
  		turf.centroid(props.toFoundLine().makeGeoJSON()).geometry.coordinates;
    const lon = centroid[0];
    const lat = centroid[1];
    let ht = null;
    if (props.edgesCollection) {
      ht = Coordinate.heightOfArbitraryNode(
        props, new Coordinate(lon, lat, 0)
      ) + htOffset + props.lowestNode[2];
    } else {
      ht = props.hierarchy[2] + htOffset;
    }
		return (
		<Entity
			id={uuid()}
			name={props.name}
      position={new Cesium.CallbackProperty(() => {
        return new Cesium.Cartesian3.fromDegrees(lon, lat, ht);
      }, false)}
			label={{
        text: props.name,
        font: '14px sans-serif',
        fillColor: Cesium.Color.BLACK,
        translucencyByDistance: new Cesium.NearFarScalar(50, 1.0, 100, 0.0),
        rotation : Cesium.Math.toRadians(180),
        alignedAxis : Cesium.Cartesian3.UNIT_Z
			}}
			show={props.show}
		/>
	)
};

export default PolygonLabel;
