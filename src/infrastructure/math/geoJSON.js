import * as martinez from 'martinez-polygon-clipping';

export const makeMultiPolygonGeoJson = (geoJsonArray) => {
  let data = {
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
      ],
    }
  }
  let combi = null;
  if (geoJsonArray.length !== 0) combi = geoJsonArray[0].geometry.coordinates
  geoJsonArray.forEach(geo =>{
    combi = martinez.union(
      combi, geo.geometry.coordinates
    );
    // return data.geometry.coordinates.push(geo.geometry.coordinates)
  });
  data.geometry.coordinates = combi || [];
  return data;
}
