import * as turf from '@turf/turf';

export const makeUnionPolygonGeoJson = (geoJsonArray) => {
  let data = {
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
      ],
    }
  }
  let combi = null;
  if (geoJsonArray.length !== 0) {
    combi = turf.polygon(
      geoJsonArray[0].geometry.coordinates
    );
  }
  geoJsonArray.forEach(geo =>{
    combi = turf.union(
      combi, geo
    );
  });
  if (combi !== null) {
    return combi;
  }
  else {
    return data;
  }
}
