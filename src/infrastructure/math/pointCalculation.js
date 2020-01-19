import * as Cesium from 'cesium';

import Coordinate from '../point/coordinate';
import Point from '../point/point';
import { angleBetweenBrngs } from './math';
import {
  cartesianToPoint,
  getPlaneEquationForPoint,
  getPlaneEquationForCartesian,
  getPlaneLineIntersectPointPosition,
  rotatePointWrapper,
  getRatio,
  shadow_vector
} from './shadowHelper';

export const minPanelTiltAngleOnPitchedRoof = (plane_points, panelBrng) => {
  const plane_for_point = getPlaneEquationForPoint(
    plane_points[0], plane_points[1], plane_points[2]
  );
  const plane_for_cartesian = getPlaneEquationForCartesian(
    Cesium.Cartesian3.fromDegrees(
      plane_points[0].lon, plane_points[0].lat, plane_points[0].height
    ),
    Cesium.Cartesian3.fromDegrees(
      plane_points[1].lon, plane_points[1].lat, plane_points[1].height
    ),
    Cesium.Cartesian3.fromDegrees(
      plane_points[2].lon, plane_points[2].lat, plane_points[2].height
    )
  );
  const center = Point.fromPoint(plane_points[0]);
  const center_cartesian = Cesium.Cartesian3.fromDegrees(
    center.lon, center.lat, center.height
  );
  const north_point = getPlaneLineIntersectPointPosition(
    new Point(center.lon, center.lat + 0.00001, 0),
    new Point(center.lon, center.lat + 0.00001, 5),
    plane_for_point
  );
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
  const new_matrix = rotatePointWrapper(
    plane_for_cartesian[0], plane_for_cartesian[1], plane_for_cartesian[2],
    center_cartesian, current_matrix, -theta
  );
  const new_point = cartesianToPoint(
    new_matrix[0][0], new_matrix[1][0], new_matrix[2][0]
  );

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

  return minPanelTilt * 180 / Math.PI;
}

//const getHighAndFixedIndex = (panel_points, p_ratio) => {
//    for (var i = 1; i < 4; ++i) {
//        var delta_lon = panel_points[0].lon - panel_points[i].lon;
//        var delta_lat = panel_points[0].lat - panel_points[i].lat;
//        var delta_height = panel_points[0].height - panel_points[i].height;

//        if (delta_lon / p_ratio[0] === delta_height && delta_lat / p_ratio[1] === delta_height) {
//            if (delta_height < 0) return [0, i];
//            else return [i, 0];
//        }
//    }
//    return null;
//}

export const generatePanelPoints = (point, panel_al, panel_az, panel_length) => {
  const travelDist = Math.cos(panel_al * Math.PI / 180) * panel_length;
  const tempCor = Point.destination(point, panel_az, travelDist);
  const high_point = Point.fromCoordinate(tempCor);
  high_point.setCoordinate(
    null, null, Math.sin(panel_al * Math.PI / 180) * panel_length + point.height
  );

  return [high_point, point];
}

/**
 * [calculatePanelShadowLength description]
 * @param  {Point[]} plane_points  б���涥�㼯
 * @param  {Number} panel_al       ̫���ܰ��߶Ƚ� in degrees
 * @param  {Number} panel_length  板长度
 * @param  {Number} panel_az       ̫���ܰ巽λ��
 * @return {Number}                ��Ӱ���� in meters
 */
export const calculatePanelShadowLength = (
  plane_points, panel_al, panel_az, panel_length, solar_position
) => {
  const ratio = getRatio(plane_points[0].lon, plane_points[0].lat);

  const panel_points = generatePanelPoints(
    plane_points[0], panel_al, panel_az + 180, panel_length
  );

  const high_point = panel_points[0];
  const low_point = panel_points[1];

  const s_vec = shadow_vector(solar_position);
  const s_ratio = [ratio[0] * s_vec[0], ratio[1] * s_vec[1]];

  const plane_equation = getPlaneEquationForPoint(
    plane_points[0], plane_points[1], plane_points[2]
  );
  const ref_point = new Point(
    high_point.lon + s_ratio[0],
    high_point.lat + s_ratio[1],
    high_point.height - 1
  );
  const joint = getPlaneLineIntersectPointPosition(
    high_point, ref_point, plane_equation
  );
  const shadowLength = Coordinate.linearDistance(
    new Coordinate(joint.lon, joint.lat, joint.height),
    new Coordinate(low_point.lon, low_point.lat, low_point.height),
  );
  const shadowBrng = Coordinate.bearing(
    new Coordinate(low_point.lon, low_point.lat, low_point.height),
    new Coordinate(joint.lon, joint.lat, joint.height)
  )
  const brngDiff = angleBetweenBrngs(panel_az + 180, shadowBrng);
  const trueShadowLength = Math.cos(brngDiff * Math.PI / 180) * shadowLength;

  return trueShadowLength - Math.cos(panel_al * Math.PI / 180) * panel_length;
}

export const getPrependicularFoot = (A, B, P) => {
  const x1 = A.lon;
  const y1 = A.lat;
  const z1 = A.height;

  const x2 = B.lon;
  const y2 = B.lat;
  const z2 = B.height;

  const x3 = P.lon;
  const y3 = P.lat;
  const z3 = P.height;

  const k = [x2 - x1, y2 - y1, z2 - z1];
  const b = [x3 - x1, y3 - y1, z3 - z1];
  const p = (k[0] * b[0] + k[1] * b[1] + k[2] * b[2]) /
            (k[0] * k[0] + k[1] * k[1] + k[2] * k[2]);

  return new Point(p * (x2 - x1) + x1, p * (y2 - y1) + y1, p * (z2 - z1) + z1);
}

export const getAltitudeAzimuth = (point1, point2, point3) => {
  var delta_lon = point3.lon - point2.lon;
  var delta_lat = point3.lat - point2.lat;
  var delta_height = point3.height - point2.height;

  const target_height = point1.height - point2.height;

  delta_lon = delta_lon / delta_height * target_height;
  delta_lat = delta_lat / delta_height * target_height;

  var high_ref_point = new Point(
    point2.lon + delta_lon,
    point2.lat + delta_lat,
    point2.height + target_height
  );

  var vertical_point = point2;
  var low_point = point1;
  if (delta_height === 0) {
    high_ref_point = point3;
    low_point = point2;
    vertical_point = point1;
  } else if (target_height === 0) {
    high_ref_point = point1;
    low_point = point2;
    vertical_point = point3;
  }
  var joint = getPrependicularFoot(high_ref_point, low_point, vertical_point);

  const joint_ref_cartesian = Cesium.Cartesian3.fromDegrees(
    joint.lon, joint.lat, vertical_point.height
  );
  const p2_cartesian = Cesium.Cartesian3.fromDegrees(
    vertical_point.lon, vertical_point.lat, vertical_point.height
  );
  const north_cartesian = Cesium.Cartesian3.fromDegrees(
    vertical_point.lon, vertical_point.lat + 0.00001, vertical_point.height
  );

  // joint_ref_cartesian, p2_cartesian, north_cartesian
  const v1x = joint_ref_cartesian.x - p2_cartesian.x;
  const v1y = joint_ref_cartesian.y - p2_cartesian.y;
  const v1z = joint_ref_cartesian.z - p2_cartesian.z;
  const mod1 = Math.sqrt(v1x * v1x + v1y * v1y + v1z * v1z);

  const v2x = north_cartesian.x - p2_cartesian.x;
  const v2y = north_cartesian.y - p2_cartesian.y;
  const v2z = north_cartesian.z - p2_cartesian.z;
  const mod2 = Math.sqrt(v2x * v2x + v2y * v2y + v2z * v2z);

  const cosine1 = (v1x * v2x + v1y * v2y + v1z * v2z) / (mod1 * mod2);
  const azimuth = Math.acos(cosine1) * 180 / Math.PI;

  const joint_cartesian = Cesium.Cartesian3.fromDegrees(
    joint.lon, joint.lat, joint.height
  );

  // joint_cartesian, p2_partesian, joint_ref_cartesian
  const v3x = joint_cartesian.x - p2_cartesian.x;
  const v3y = joint_cartesian.y - p2_cartesian.y;
  const v3z = joint_cartesian.z - p2_cartesian.z;
  const mod3 = Math.sqrt(v3x * v3x + v3y * v3y + v3z * v3z);

  const cosine2 = (v1x * v3x + v1y * v3y + v1z * v3z) / (mod1 * mod3);
  const altitude = Math.acos(cosine2) * 180 / Math.PI;

  return [altitude, azimuth];
}
