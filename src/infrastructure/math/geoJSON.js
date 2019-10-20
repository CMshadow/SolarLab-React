export const makeMultiPolygonGeoJson = (geoJsonArray) => {
  let data = {
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
      ],
    }
  }
  geoJsonArray.forEach(geo =>
    data.geometry.coordinates.push(geo.geometry.coordinates)
  );
  return data;
}
