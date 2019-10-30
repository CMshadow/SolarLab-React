import * as Cesium from 'cesium';

import Coordinate from '../point/coordinate';


export const math_make_a_line = (x1, y1, x2, y2) => {
  var line_a = ((y2 - y1) / (x2 - x1));
  var line_b = (y1 - (line_a * x1));
  return [line_a, line_b, [x1, y1], [x2, y2]];
}

export const coordinateToVector = (coordinate) => {
  var latRadians = Cesium.Math.toRadians(coordinate.lat);
  var lonRadians = Cesium.Math.toRadians(coordinate.lon);

  var x = Math.cos(latRadians) * Math.cos(lonRadians);
  var y = Math.cos(latRadians) * Math.sin(lonRadians);
  var z = Math.sin(latRadians);

  return [x, y, z];
};

export const vectorToCoordinate = (v, height) => {
    var latRadians = Math.atan2(v[2], Math.sqrt(v[0]*v[0] + v[1]*v[1]));
    var lonRadians = Math.atan2(v[1], v[0]);

    return new Coordinate(
      Cesium.Math.toDegrees(lonRadians),
      Cesium.Math.toDegrees(latRadians),
      height
    );
};

export const greatCircle = (coordinate, bearing) => {
    var latRadians = Cesium.Math.toRadians(coordinate.lat);
    var lonRadians = Cesium.Math.toRadians(coordinate.lon);
    var brngRadians = Cesium.Math.toRadians(bearing);

    var x = Math.sin(lonRadians) * Math.cos(brngRadians) - Math.sin(latRadians)
      * Math.cos(lonRadians) * Math.sin(brngRadians);
    var y = -Math.cos(lonRadians) * Math.cos(brngRadians) - Math.sin(latRadians)
      * Math.sin(lonRadians) * Math.sin(brngRadians);
    var z = Math.cos(latRadians) * Math.sin(brngRadians);

    return [x, y, z];
};

export const cross = (v1,v2) => {

    var x = v1[1] * v2[2] - v1[2] * v2[1];
    var y = v1[2] * v2[0] - v1[0] * v2[2];
    var z = v1[0] * v2[1] - v1[1] * v2[0];

    return [x, y, z];
};

export const dot = (v1,v2) => {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
};

export const plus = (v1,v2) => {
    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
};
