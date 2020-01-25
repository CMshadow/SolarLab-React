import * as turf from '@turf/turf';
import * as Cesium from 'cesium';

import Coordinate from '../point/coordinate';
import Point from '../point/point';
import Polyline from '../../infrastructure/line/polyline';
import * as martinez from 'martinez-polygon-clipping';


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

export const getPlaneEquationForPoint = (point1, point2, point3) => {

  const a = (point2.lat - point1.lat) * (point3.height - point1.height) -
            (point2.height - point1.height) * (point3.lat - point1.lat);

  const b = (point2.height - point1.height) * (point3.lon - point1.lon) -
            (point2.lon - point1.lon) * (point3.height - point1.height);

  const c = (point2.lon - point1.lon) * (point3.lat - point1.lat) -
            (point2.lat - point1.lat) * (point3.lon - point1.lon);

  const d = 0 - (a * point1.lon + b * point1.lat + c * point1.height);

  return [a, b, c, d]; // ax + by + cz + d = 0
}

export const getPlaneEquationForCartesian = (
  cartesian1, cartesian2, cartesian3
) => {

  const a = (cartesian2.y - cartesian1.y) * (cartesian3.z - cartesian1.z) -
            (cartesian2.z - cartesian1.z) * (cartesian3.y - cartesian1.y);

  const b = (cartesian2.z - cartesian1.z) * (cartesian3.x - cartesian1.x) -
            (cartesian2.x - cartesian1.x) * (cartesian3.z - cartesian1.z);

  const c = (cartesian2.x - cartesian1.x) * (cartesian3.y - cartesian1.y) -
            (cartesian2.y - cartesian1.y) * (cartesian3.x - cartesian1.x);

  const d = 0 - (a * cartesian1.x + b * cartesian1.y + c * cartesian1.z);

  return [a, b, c, d]; // ax + by + cz + d = 0
}

export const getPlaneLineIntersectPointPosition = (
  point1, point2, plane_equation
) => {
  const l1 = point2.lon - point1.lon;
  const l2 = point2.lat - point1.lat;
  const l3 = point2.height - point1.height;

  const m1 = point1.lon;
  const m2 = point1.lat;
  const m3 = point1.height;

  const a = plane_equation[0];
  const b = plane_equation[1];
  const c = plane_equation[2];
  const d = plane_equation[3];

  let z = null;
  if (l1 === 0 && l2 === 0) {
    z = 0 - (a * m1 + b * m2 + d) / c;
    return new Point(m1, m2, z);
  }

  const x = ((b * l2 / l1 + c * l3 / l1) * m1 - b * m2 - c * m3 - d) /
            (a + b * l2 / l1 + c * l3 / l1);
  const y = (x - m1) * l2 / l1 + m2;
  z = (x - m1) * l3 / l1 + m3;

  return new Point(x, y, z);
}

export const shadow_vector = (solar_position) => {
  const DegtoRad = Math.PI / 180;
  const rx = -Math.sin((-solar_position[1] + 180) * DegtoRad) /
    Math.tan(solar_position[0] * DegtoRad);
  let ry = Math.cos((-solar_position[1] + 180) * DegtoRad) /
    Math.tan(solar_position[0] * DegtoRad);
  if (solar_position[0] < 0) {
    ry = null;
    return null;
  }
  return [rx, ry];
}

export const getRatio = (lon, lat) => {
  const unit_lon = lon + 0.001;
  const unit_lat = lat + 0.001;
  const originPoint = new Coordinate(lon, lat, 0.0);
  const newLongPoint = new Coordinate(unit_lon, lat, 0.0);
  const newLatPoint = new Coordinate(lon, unit_lat, 0.0);
  const ratio_Longitude = Coordinate.surfaceDistance(originPoint, newLongPoint);
  const ratio_Latitude = Coordinate.surfaceDistance(originPoint, newLatPoint);
  return [0.001 / ratio_Longitude, 0.001 / ratio_Latitude];
}

export const getShadowLineForPoint = (point, s_ratio, plane_equation) => {
  const vertical_point = new Point(point.lon, point.lat, 0);
  const shadow_x = point.lon + s_ratio[0] * point.height;
  const shadow_y = point.lat + s_ratio[1] * point.height;
  const shadow_point = new Point(shadow_x, shadow_y, 0);
  const plane_point1 = getPlaneLineIntersectPointPosition(
    point, vertical_point, plane_equation
  );
  let plane_point2 = getPlaneLineIntersectPointPosition(
    point, shadow_point, plane_equation
  );
  if (plane_point2.height > point.height) {
    plane_point2 = point;
  }
  return [plane_point1, plane_point2]
}

export const getParallelogramsForPlane = (
  point_list, s_ratio, plane_equation
) => {
  if (point_list.length <= 1) return null;
  const point_pair_list = point_list.map(p =>
    getShadowLineForPoint(p, s_ratio, plane_equation)
  );
  const parallelograms = [];
  for (let i = 0; i < point_pair_list.length; ++i) {
    const parallelogram = [];
    parallelogram.push(point_pair_list[i][0]);
    parallelogram.push(point_pair_list[i][1]);
    parallelogram.push(point_pair_list[(i+1)%point_pair_list.length][1]);
    parallelogram.push(point_pair_list[(i+1)%point_pair_list.length][0]);
    parallelogram.push(point_pair_list[i][0]);
    const uniqueParallelogram = [];
    const uniqueness = [];
    parallelogram.forEach(val => {
      if (!uniqueness.includes(val.getCoordinate(true).slice(0,2).toString())) {
        uniqueness.push(val.getCoordinate(true).slice(0,2).toString());
        uniqueParallelogram.push(val);
      }
    })
    uniqueParallelogram.push(uniqueParallelogram[0]);
    if (uniqueness.length > 2) parallelograms.push(uniqueParallelogram);
  }
  return parallelograms;
}

export const unionPolygons = (point_list1, point_list2, plane_equation) => {
  const polyline1 = new Polyline(point_list1, false);
  const polyline2 = new Polyline(point_list2, false);
  let union = turf.union(polyline1.makeGeoJSON(),polyline2.makeGeoJSON())
    .geometry.coordinates[0];
  const result_point_list = union.map(u =>
    getPlaneLineIntersectPointPosition(
      new Point(u[0], u[1], 0.0),
      new Point(u[0], u[1], 5.0),
      plane_equation
    )
  );
  return result_point_list;
}

export const intersectPolygons = (point_list1, point_list2, plane_equation) => {
  const polyline1 = new Polyline(point_list1, false);
  const polyline2 = new Polyline(point_list2, false);
  let intersection = martinez.intersection(
    polyline1.makeGeoJSON().geometry.coordinates,
    polyline2.makeGeoJSON().geometry.coordinates
  );
  if (intersection === null || intersection.length === 0) return [];
  intersection = intersection[0][0];
  const result_point_list = intersection.map(inter =>
    getPlaneLineIntersectPointPosition(
      new Point(inter[0], inter[1], 0.0),
      new Point(inter[0], inter[1], 5.0),
      plane_equation
    )
  );
  return result_point_list;
}

export const projectPlaneOnAnother = (
  point_list1, point_list2, plane_equation, s_ratio, cover
) => {
  const copy_point_list2 = point_list2.map(p => Point.fromPoint(p));
  if (point_list1.length < 3 || copy_point_list2.length < 3) return null;
  copy_point_list2.push(copy_point_list2[0]);
  const parallelograms = getParallelogramsForPlane(
    point_list1, s_ratio, plane_equation
  ).map(points => new Polyline(points).makeGeoJSON());
  if (cover === true && parallelograms.length !== 0) {
   const union = turf.union(...parallelograms);
   const result_point_list = union.geometry.coordinates[0].map(u =>
     getPlaneLineIntersectPointPosition(
       new Point(u[0], u[1], 0.0),
       new Point(u[0], u[1], 5.0),
       plane_equation
     )
   );
   return [result_point_list];
  }
  else {
   return parallelograms;
  }
}

export const projectTreeOnPlane = (
  center, treePoints, trunkPoints, foundationPoints, plane_equation, s_ratio
) => {
  let shadowPoints = treePoints.map(p =>
    getShadowLineForPoint(p, s_ratio, plane_equation)[1]
  );
  shadowPoints.push(shadowPoints[0]);
  return [shadowPoints];
  // const parallelograms = getParallelogramsForPlane(
  //   trunkPoints, s_ratio, plane_equation
  // )
  // .filter(points => !new Polyline(points).isSelfIntersection())
  // .map(points => new Polyline(points).makeGeoJSON());
  // if (parallelograms.length !== 0) {
  //   let union = turf.union(...parallelograms);
  //   union = turf.union(union, new Polyline(shadowPoints).makeGeoJSON());
  //   const result_point_list = union.geometry.coordinates[0].map(u =>
  //     getPlaneLineIntersectPointPosition(
  //       new Point(u[0], u[1], 0.0),
  //       new Point(u[0], u[1], 5.0),
  //       plane_equation
  //     )
  //   );
  //   return [result_point_list];
  // } else{
  //   return parallelograms;
  // }
}

export const getSphereLineIntersection = (
  center_cartesian, radius, vx, vy, vz
) => {
  const cx = center_cartesian.x;
  const cy = center_cartesian.y;
  const cz = center_cartesian.z;

  const A = vx * vx + vy * vy + vz * vz;
  const D = 4 * A * (radius * radius);

  const t = Math.sqrt(D) / (2 * A);

  const joint1 = new Cesium.Cartesian3(cx + t * vx, cy + t * vy, cz - t * vz);
  const joint2 = new Cesium.Cartesian3(cx - t * vx, cy - t * vy, cz - t * vz);

  return [joint1, joint2];
}

export const computeInverseMatrix = (m) => {
  const A2323 = m[2][2] * m[3][3] - m[2][3] * m[3][2];
  const A1323 = m[2][1] * m[3][3] - m[2][3] * m[3][1];
  const A1223 = m[2][1] * m[3][2] - m[2][2] * m[3][1];
  const A0323 = m[2][0] * m[3][3] - m[2][3] * m[3][0];
  const A0223 = m[2][0] * m[3][2] - m[2][2] * m[3][0];
  const A0123 = m[2][0] * m[3][1] - m[2][1] * m[3][0];
  const A2313 = m[1][2] * m[3][3] - m[1][3] * m[3][2];
  const A1313 = m[1][1] * m[3][3] - m[1][3] * m[3][1];
  const A1213 = m[1][1] * m[3][2] - m[1][2] * m[3][1];
  const A2312 = m[1][2] * m[2][3] - m[1][3] * m[2][2];
  const A1312 = m[1][1] * m[2][3] - m[1][3] * m[2][1];
  const A1212 = m[1][1] * m[2][2] - m[1][2] * m[2][1];
  const A0313 = m[1][0] * m[3][3] - m[1][3] * m[3][0];
  const A0213 = m[1][0] * m[3][2] - m[1][2] * m[3][0];
  const A0312 = m[1][0] * m[2][3] - m[1][3] * m[2][0];
  const A0212 = m[1][0] * m[2][2] - m[1][2] * m[2][0];
  const A0113 = m[1][0] * m[3][1] - m[1][1] * m[3][0];
  const A0112 = m[1][0] * m[2][1] - m[1][1] * m[2][0];

  let det =
    + m[0][0] * (m[1][1] * A2323 - m[1][2] * A1323 + m[1][3] * A1223)
    - m[0][1] * (m[1][0] * A2323 - m[1][2] * A0323 + m[1][3] * A0223)
    + m[0][2] * (m[1][0] * A1323 - m[1][1] * A0323 + m[1][3] * A0123)
    - m[0][3] * (m[1][0] * A1223 - m[1][1] * A0223 + m[1][2] * A0123);
  det = 1 / det;

  const m00 = det * (m[1][1] * A2323 - m[1][2] * A1323 + m[1][3] * A1223);
  const m01 = det * - (m[0][1] * A2323 - m[0][2] * A1323 + m[0][3] * A1223);
  const m02 = det * (m[0][1] * A2313 - m[0][2] * A1313 + m[0][3] * A1213);
  const m03 = det * - (m[0][1] * A2312 - m[0][2] * A1312 + m[0][3] * A1212);
  const m10 = det * - (m[1][0] * A2323 - m[1][2] * A0323 + m[1][3] * A0223);
  const m11 = det * (m[0][0] * A2323 - m[0][2] * A0323 + m[0][3] * A0223);
  const m12 = det * - (m[0][0] * A2313 - m[0][2] * A0313 + m[0][3] * A0213);
  const m13 = det * (m[0][0] * A2312 - m[0][2] * A0312 + m[0][3] * A0212);
  const m20 = det * (m[1][0] * A1323 - m[1][1] * A0323 + m[1][3] * A0123);
  const m21 = det * - (m[0][0] * A1323 - m[0][1] * A0323 + m[0][3] * A0123);
  const m22 = det * (m[0][0] * A1313 - m[0][1] * A0313 + m[0][3] * A0113);
  const m23 = det * - (m[0][0] * A1312 - m[0][1] * A0312 + m[0][3] * A0112);
  const m30 = det * - (m[1][0] * A1223 - m[1][1] * A0223 + m[1][2] * A0123);
  const m31 = det * (m[0][0] * A1223 - m[0][1] * A0223 + m[0][2] * A0123);
  const m32 = det * - (m[0][0] * A1213 - m[0][1] * A0213 + m[0][2] * A0113);
  const m33 = det * (m[0][0] * A1212 - m[0][1] * A0212 + m[0][2] * A0112);

  return [
    [m00, m01, m02, m03],
    [m10, m11, m12, m13],
    [m20, m21, m22, m23],
    [m30, m31, m32, m33]
  ]
}

export const multiplyMatrices = (m1, m2) => {
  const result = [];
  for (var i = 0; i < m1.length; i++) {
    result.push([]);
    for (var j = 0; j < m2[0].length; j++) {
      var sum = 0;
      for (var k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i].push(sum);
    }
  }
  return result;
}

export const rotatePoint = (T, Rx, Ry, Rz, current) => {
  let result = computeInverseMatrix(T);
  result = multiplyMatrices(result, computeInverseMatrix(Rx));
  result = multiplyMatrices(result, computeInverseMatrix(Ry));
  result = multiplyMatrices(result, Rz);
  result = multiplyMatrices(result, Ry);
  result = multiplyMatrices(result, Rx);
  result = multiplyMatrices(result, T);
  result = multiplyMatrices(result, current);
  return result;
}

export const rotatePointWrapper = (
  vx, vy, vz, center_cartesian, current_matrix, theta
) => {
  const mod = Math.sqrt(vx * vx + vy * vy + vz * vz);

  const a = vx / mod;
  const b = vy / mod;
  const c = vz / mod;
  const d = Math.sqrt(b * b + c * c);

  const T = [
    [1, 0, 0, -center_cartesian.x],
    [0, 1, 0, -center_cartesian.y],
    [0, 0, 1, -center_cartesian.z],
    [0, 0, 0, 1]
  ];
  const Rx = [
    [1, 0, 0, 0],
    [0, c / d, -b / d, 0],
    [0, b / d, c / d, 0],
    [0, 0, 0, 1]
  ];
  const Ry = [
    [d, 0, -a, 0],
    [0, 1, 0, 0],
    [a, 0, d, 0],
    [0, 0, 0, 1]
  ];
  const Rz = [
    [Math.cos(theta), -Math.sin(theta), 0, 0],
    [Math.sin(theta), Math.cos(theta), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ];
  return rotatePoint(T, Rx, Ry, Rz, current_matrix);
}

export const generateTreePolygon = (centerPoint, radius, s_ratio, s_vec) => {
  const center_cartesian = Cesium.Cartesian3.fromDegrees(
    centerPoint.lon, centerPoint.lat, centerPoint.height
  );
  const extra_cartesian = Cesium.Cartesian3.fromDegrees(
    centerPoint.lon + s_ratio[0],
    centerPoint.lat + s_ratio[1],
    centerPoint.height - 1
  );

  const vx = extra_cartesian.x - center_cartesian.x;
  const vy = extra_cartesian.y - center_cartesian.y;
  const vz = extra_cartesian.z - center_cartesian.z;

  const a1a2 = getSphereLineIntersection(center_cartesian, radius, vx, vy, vz);
  const a3 = Cesium.Cartesian3.fromDegrees(
    centerPoint.lon, centerPoint.lat, centerPoint.height + radius
  );

  const vertical_plane = getPlaneEquationForCartesian(a1a2[0], a1a2[1], a3);
  const horizontal_d = - vx * center_cartesian.x - vy * center_cartesian.y -
    vz * center_cartesian.z;
  const horizontal_plane = [vx, vy, vz, horizontal_d];

  const ky =
    (
      horizontal_plane[0] * vertical_plane[2] -
      vertical_plane[0] * horizontal_plane[2]
    ) / (
      vertical_plane[1] * horizontal_plane[2] -
      horizontal_plane[1] * vertical_plane[2]
    ); // y = kx + b
  var kz =
    (
      horizontal_plane[0] * vertical_plane[1] -
      vertical_plane[0] * horizontal_plane[1]
    ) / (
      vertical_plane[2] * horizontal_plane[1] -
      horizontal_plane[2] * vertical_plane[1]
    ); // z = kx + b
  const A = ky * ky + kz * kz + 1;
  const x = Math.sqrt(radius * radius / A);

  const result_cartesian_list = [];
  result_cartesian_list.push(new Cesium.Cartesian3(
    center_cartesian.x + x,
    center_cartesian.y + ky * x,
    center_cartesian.z + kz * x
  ));

  const theta = 0.349066; // 20 degrees = 0.349066 radians

  for (let i = 0; i < 17; ++i) {
    const current_matrix = [
      [result_cartesian_list[i].x],
      [result_cartesian_list[i].y],
      [result_cartesian_list[i].z],
      [1]
    ];
    const new_matrix = rotatePointWrapper(
      vx, vy, vz, center_cartesian, current_matrix, theta
    );
    result_cartesian_list.push(new Cesium.Cartesian3(
      new_matrix[0][0], new_matrix[1][0], new_matrix[2][0]
    ));
  }

  const result_point_list = [];
  for (let i = 0; i < 18; ++i) {
    const temp = Cesium.Cartographic.fromCartesian(
      new Cesium.Cartesian3(
        result_cartesian_list[i].x,
        result_cartesian_list[i].y,
        result_cartesian_list[i].z
      )
    );
    const temp_lon = parseFloat(
      Cesium.Math.toDegrees(temp.longitude).toFixed(12)
    );
    const temp_lat = parseFloat(
      Cesium.Math.toDegrees(temp.latitude).toFixed(12)
    );
    result_point_list.push(
      cartesianToPoint(
        result_cartesian_list[i].x,
        result_cartesian_list[i].y,
        result_cartesian_list[i].z
      )
    );
  }

  return result_point_list;
}
