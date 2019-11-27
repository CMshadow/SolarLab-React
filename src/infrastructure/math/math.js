import * as Cesium from 'cesium';

import Coordinate from '../point/coordinate';
import Point from '../point/point';
import { getPlaneEquationForPoint, rotatePointWrapper } from './shadowHelper';


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

export const cartesianToPoint = (x, y, z) => {
    const temp = Cesium.Cartographic.fromCartesian(
        new Cesium.Cartesian3(x, y, z)
    );
    const temp_lon = parseFloat(
        Cesium.Math.toDegrees(temp.longitude).toFixed(12)
    );
    const temp_lat = parseFloat(
        Cesium.Math.toDegrees(temp.latitude).toFixed(12)
    );

    return new Point(temp_lon, temp_lat, temp.height);
}

/**
 * [minPanelTiltAngleOnPitchedRoof description]
 * @param  {Point[]} plane_points  斜屋面顶点集
 * @param  {Number} panelBrng 斜屋面要铺板的朝向 0到360之间
 * @return {Number}           铺板和地面的的最小夹角让板不会陷入斜屋面中 in radians
 */
const minPanelTiltAngleOnPitchedRoof = (plane_points, panelBrng) => {

  const plane = getPlaneEquationForPoint(plane_points[0], plane_points[1], plane_points[2]);
  const center = plane_points[0];
  const center_cartesian = Cesium.Cartesian3.fromDegrees(
      center.lon, center.lat, center.height
  );
  const north_point = new Point(center.lon + 0.001, center.lat, center.height);
  const north_point_cartesian = Cesium.Cartesian3.fromDegrees(
      north_point.lon, north_point.lat, north_point.height
  );
  
  const current_matrix = [
      [north_point_cartesian.x],
      [north_point_cartesian.y],
      [north_point_cartesian.z],
      [1]
  ];
  const theta = panelBrng / 180 * Math.PI;
  const new_matrix = rotatePointWrapper(plane[0], plane[1], plane[2], center_cartesian, current_matrix, theta);
  const new_point = cartesianToPoint(new_matrix[0][0], new_matrix[1][0], new_matrix[2][0]);
  
  // segment between new_point and center
  const new_point_reference = new Point(new_point.lon, new_point.lat, 0);
  const new_point_reference_cartesian = Cesium.Cartesian3.fromDegrees(
      new_point_reference.lon, new_point_reference.lat, new_point_reference.height
  );
  const center_reference = new Point(center.lon, center.lat, 0);
  const center_reference_cartesian = Cesium.Cartesian3.fromDegrees(
      center_reference.lon, center_reference.lat, center_reference.height
  );

  const vx1 = new_matrix[0][0] - center_cartesian.x;
  const vy1 = new_matrix[1][0] - center_cartesian.y;
  const vz1 = new_matrix[2][0] - center_cartesian.z;
  
  const vx2 = new_point_reference_cartesian.x - center_reference_cartesian.x;
  const vy2 = new_point_reference_cartesian.y - center_reference_cartesian.y;
  const vz2 = new_point_reference_cartesian.z - center_reference_cartesian.z;

  const mod_1 = Math.sqrt(vx1 * vx1 + vy1 * vy1 + vz1 * vz1);
  const mod_2 = Math.sqrt(vx2 * vx2 + vy2 * vy2 + vz2 * vz2);
  const dot_product = vx1 * vx2 + vy1 * vy2 + vz1 * vz2;
  const cos_theta = dot_product / (mod_1 * mod_2);
  const minPanelTilt = Math.acos(cos_theta);

  return minPanelTilt
}
