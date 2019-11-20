import * as turf from '@turf/turf';

import Point from '../point/point';
import Polygon from "../../infrastructure/Polygon/Polygon";
import Polyline from '../../infrastructure/line/polyline';
import { calculateSunPositionWrapper } from './sunPositionCalculation';
import * as martinez from 'martinez-polygon-clipping';

import * as Cesium from 'cesium';

export const getPlaneEquationForPoint = (point1, point2, point3) => {

    var a = (point2.lat - point1.lat) * (point3.height - point1.height) -
            (point2.height - point1.height) * (point3.lat - point1.lat);

    var b = (point2.height - point1.height) * (point3.lon - point1.lon) -
            (point2.lon - point1.lon) * (point3.height - point1.height);

    var c = (point2.lon - point1.lon) * (point3.lat - point1.lat) -
            (point2.lat - point1.lat) * (point3.lon - point1.lon);

    var d = 0 - (a * point1.lon + b * point1.lat + c * point1.height);

    return [a, b, c, d]; // ax + by + cz + d = 0
}

export const getPlaneEquationForCartesian = (cartesian1, cartesian2, cartesian3) => {

    var a = (cartesian2.y - cartesian1.y) * (cartesian3.z - cartesian1.z) -
        (cartesian2.z - cartesian1.z) * (cartesian3.y - cartesian1.y);

    var b = (cartesian2.z - cartesian1.z) * (cartesian3.x - cartesian1.x) -
        (cartesian2.x - cartesian1.x) * (cartesian3.z - cartesian1.z);

    var c = (cartesian2.x - cartesian1.x) * (cartesian3.y - cartesian1.y) -
        (cartesian2.y - cartesian1.y) * (cartesian3.x - cartesian1.x);

    var d = 0 - (a * cartesian1.x + b * cartesian1.y + c * cartesian1.z);

    return [a, b, c, d]; // ax + by + cz + d = 0
}

export const getPlaneLineIntersectPointPosition = (point1, point2, plane_equation) => {
    var l1 = point2.lon - point1.lon;
    var l2 = point2.lat - point1.lat;
    var l3 = point2.height - point1.height;

    var m1 = point1.lon;
    var m2 = point1.lat;
    var m3 = point1.height;

    var a = plane_equation[0];
    var b = plane_equation[1];
    var c = plane_equation[2];
    var d = plane_equation[3];

    if (l1 == 0 && l2 == 0) {
        var z = 0 - (a * m1 + b * m2 + d) / c;
        return new Point(m1, m2, z);
    }

    var x = ((b * l2 / l1 + c * l3 / l1) * m1 - b * m2 - c * m3 - d) / (a + b * l2 / l1 + c * l3 / l1);
    var y = (x - m1) * l2 / l1 + m2;
    var z = (x - m1) * l3 / l1 + m3;

    return new Point(x, y, z);
}

export const shadow_vector = (solar_position) => {
    var DegtoRad = Math.PI / 180;
    var rx = -Math.sin((-solar_position[1] + 180) * DegtoRad) / Math.tan(solar_position[0] * DegtoRad);
    var ry = Math.cos((-solar_position[1] + 180) * DegtoRad) / Math.tan(solar_position[0] * DegtoRad);
    if (solar_position[0] < 0) {
        ry = null;
        alert("Sunset already.");
    }
    return [rx, ry];
}

export const getRatio = (lon, lat) => {
    var unit_lon = lon + 0.001;
    var unit_lat = lat + 0.001;
    var originPoint = new Cesium.Cartesian3.fromDegrees(lon, lat, 0.0);
    var newLongPoint = new Cesium.Cartesian3.fromDegrees(unit_lon, lat, 0.0);
    var newLatPoint = new Cesium.Cartesian3.fromDegrees(lon, unit_lat, 0.0);
    var ratio_Longitude = Cesium.Cartesian3.distance(originPoint, newLongPoint);
    var ratio_Latitude = Cesium.Cartesian3.distance(originPoint, newLatPoint);
    return [0.001 / ratio_Longitude, 0.001 / ratio_Latitude];
}

export const getShadowLineForPoint = (point, s_ratio, plane_equation) => {
    var vertical_point = new Point(point.lon, point.lat, 0);
    var shadow_x = point.lon + s_ratio[0] * point.height;
    var shadow_y = point.lat + s_ratio[1] * point.height;
    var shadow_point = new Point(shadow_x, shadow_y, 0);
    var plane_point1 = getPlaneLineIntersectPointPosition(point, vertical_point, plane_equation);
    var plane_point2 = getPlaneLineIntersectPointPosition(point, shadow_point, plane_equation);
    return [plane_point1, plane_point2]
}

export const getParallelogramsForPlane = (point_list, s_ratio, plane_equation) => {
    if (point_list.length <= 1) return null;
    var point_pair_list = [];
    for (var i = 0; i < point_list.length; ++i) {
        var point_pair = getShadowLineForPoint(point_list[i], s_ratio, plane_equation);
        point_pair_list.push(point_pair);
    }
    var parallelograms = [];
    for (var i = 0; i < point_pair_list.length; ++i) {
        var parallelogram = [];
        parallelogram.push(point_pair_list[i][0]);
        parallelogram.push(point_pair_list[i][1]);
        parallelogram.push(point_pair_list[(i+1)%point_pair_list.length][1]);
        parallelogram.push(point_pair_list[(i+1)%point_pair_list.length][0]);
        parallelogram.push(point_pair_list[i][0]);
        parallelograms.push(parallelogram);
    }
    return parallelograms
}

export const unionPolygons = (point_list1, point_list2, plane_equation) => {
    const polyline1 = new Polyline(point_list1, false);
    const polyline2 = new Polyline(point_list2, false);
    var union = turf.union(polyline1.makeGeoJSON(),
        polyline2.makeGeoJSON()).geometry.coordinates[0];
    var result_point_list = [];
    for (var i = 0; i < union.length; ++i) {
        var joint = getPlaneLineIntersectPointPosition(
            new Point(union[i][0], union[i][1], 0.0),
            new Point(union[i][0], union[i][1], 5.0),
            plane_equation
        );
        result_point_list.push(joint);
    }
    return result_point_list;
}

export const intersectPolygons = (point_list1, point_list2, plane_equation) => {
    const polyline1 = new Polyline(point_list1, false);
    const polyline2 = new Polyline(point_list2, false);
    var intersection = martinez.intersection(
        polyline1.makeGeoJSON().geometry.coordinates,
        polyline2.makeGeoJSON().geometry.coordinates
    );
    if (intersection === null || intersection.length === 0) return [];
    intersection = intersection[0][0];
    var result_point_list = [];
    for (var i = 0; i < intersection.length; ++i) {
        var joint = getPlaneLineIntersectPointPosition(
            new Point(intersection[i][0], intersection[i][1], 0.0),
            new Point(intersection[i][0], intersection[i][1], 5.0),
            plane_equation
        );
        result_point_list.push(joint);
    }
    return result_point_list;
}

export const projectPlaneOnAnother = (point_list1, point_list2, plane_equation, s_ratio, cover) => {
    if (point_list1.length < 3 || point_list2.length < 3) return null;
    point_list2.push(point_list2[0]);
    var parallelograms = getParallelogramsForPlane(point_list1, s_ratio, plane_equation);
    //if (cover === true) {
    //    var cover_plane = [];
    //    for (var i = 0; i < parallelograms.length; ++i) {
    //        cover_plane.push(parallelograms[i][1]);
    //    }
    //    cover_plane.push(cover_plane[0]);
    //    parallelograms.push(cover_plane);
    //}
    if (cover === true) {
        var union = parallelograms[0];
        for (var i = 1; i < parallelograms.length; ++i) {
            union = unionPolygons(union, parallelograms[i], plane_equation);
        }
        var result_points = intersectPolygons(union, point_list2, plane_equation);
        return [result_points];
    }
    else {
        for (var i = 0; i < parallelograms.length; ++i) {
            parallelograms[i] = intersectPolygons(parallelograms[i], point_list2, plane_equation);
        }
        return parallelograms;
    }
}

export const getSphereLineIntersection = (center_cartesian, radius, vx, vy, vz) => {

    var cx = center_cartesian.x;
    var cy = center_cartesian.y;
    var cz = center_cartesian.z;

    var A = vx * vx + vy * vy + vz * vz;
    var D = 4 * A * (radius * radius);

    var t = Math.sqrt(D) / (2 * A);

    var joint1 = new Cesium.Cartesian3(cx + t * vx, cy + t * vy, cz - t * vz);
    var joint2 = new Cesium.Cartesian3(cx - t * vx, cy - t * vy, cz - t * vz);

    return [joint1, joint2];
}

export const computeInverseMatrix = (m) => {
    var A2323 = m[2][2] * m[3][3] - m[2][3] * m[3][2];
    var A1323 = m[2][1] * m[3][3] - m[2][3] * m[3][1];
    var A1223 = m[2][1] * m[3][2] - m[2][2] * m[3][1];
    var A0323 = m[2][0] * m[3][3] - m[2][3] * m[3][0];
    var A0223 = m[2][0] * m[3][2] - m[2][2] * m[3][0];
    var A0123 = m[2][0] * m[3][1] - m[2][1] * m[3][0];
    var A2313 = m[1][2] * m[3][3] - m[1][3] * m[3][2];
    var A1313 = m[1][1] * m[3][3] - m[1][3] * m[3][1];
    var A1213 = m[1][1] * m[3][2] - m[1][2] * m[3][1];
    var A2312 = m[1][2] * m[2][3] - m[1][3] * m[2][2];
    var A1312 = m[1][1] * m[2][3] - m[1][3] * m[2][1];
    var A1212 = m[1][1] * m[2][2] - m[1][2] * m[2][1];
    var A0313 = m[1][0] * m[3][3] - m[1][3] * m[3][0];
    var A0213 = m[1][0] * m[3][2] - m[1][2] * m[3][0];
    var A0312 = m[1][0] * m[2][3] - m[1][3] * m[2][0];
    var A0212 = m[1][0] * m[2][2] - m[1][2] * m[2][0];
    var A0113 = m[1][0] * m[3][1] - m[1][1] * m[3][0];
    var A0112 = m[1][0] * m[2][1] - m[1][1] * m[2][0];

    var det =
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
    var result = [];
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
    var result = computeInverseMatrix(T);
    result = multiplyMatrices(result, computeInverseMatrix(Rx));
    result = multiplyMatrices(result, computeInverseMatrix(Ry));
    result = multiplyMatrices(result, Rz);
    result = multiplyMatrices(result, Ry);
    result = multiplyMatrices(result, Rx);
    result = multiplyMatrices(result, T);
    result = multiplyMatrices(result, current);
    return result;
}

export const generateTreePolygon = (centerPoint, radius, s_ratio, s_vec) => {
    const center_cartesian = Cesium.Cartesian3.fromDegrees(centerPoint.lon, centerPoint.lat, centerPoint.height);
    const extra_cartesian = Cesium.Cartesian3.fromDegrees(centerPoint.lon + s_ratio[0], centerPoint.lat + s_ratio[1], centerPoint.height - 1);

    var vx = extra_cartesian.x - center_cartesian.x;
    var vy = extra_cartesian.y - center_cartesian.y;
    var vz = extra_cartesian.z - center_cartesian.z;

    var a1a2 = getSphereLineIntersection(center_cartesian, radius, vx, vy, vz);
    var a3 = Cesium.Cartesian3.fromDegrees(centerPoint.lon, centerPoint.lat, centerPoint.height + radius);

    console.log("centerPoint:");
    console.log(centerPoint);

    console.log("a1:");
    var temp_a1 = Cesium.Cartographic.fromCartesian(a1a2[0]);
    console.log(parseFloat(Cesium.Math.toDegrees(temp_a1.longitude).toFixed(12)));
    console.log(parseFloat(Cesium.Math.toDegrees(temp_a1.latitude).toFixed(12)));
    console.log(temp_a1.height);
    console.log(a1a2[0]);

    console.log("a2:");
    var temp_a2 = Cesium.Cartographic.fromCartesian(a1a2[1]);
    console.log(parseFloat(Cesium.Math.toDegrees(temp_a2.longitude).toFixed(12)));
    console.log(parseFloat(Cesium.Math.toDegrees(temp_a2.latitude).toFixed(12)));
    console.log(temp_a2.height);
    console.log(a1a2[1]);

    var vertical_plane = getPlaneEquationForCartesian(a1a2[0], a1a2[1], a3);
    var horizontal_d = - vx * center_cartesian.x - vy * center_cartesian.y - vz * center_cartesian.z;
    var horizontal_plane = [vx, vy, vz, horizontal_d];

    var ky = (horizontal_plane[0] * vertical_plane[2] - vertical_plane[0] * horizontal_plane[2]) /
             (vertical_plane[1] * horizontal_plane[2] - horizontal_plane[1] * vertical_plane[2]); // y = kx + b
    var kz = (horizontal_plane[0] * vertical_plane[1] - vertical_plane[0] * horizontal_plane[1]) /
             (vertical_plane[2] * horizontal_plane[1] - horizontal_plane[2] * vertical_plane[1]); // z = kx + b
    const A = ky * ky + kz * kz + 1;
    const x = Math.sqrt(radius * radius / A);

    var result_cartesian_list = [];
    result_cartesian_list.push(new Cesium.Cartesian3(center_cartesian.x + x, center_cartesian.y + ky * x, center_cartesian.z + kz * x));

    const a = vx;
    const b = vy;
    const c = vz;
    const d = Math.sqrt(b * b + c * c);

    var T = [
        [1, 0, 0, -center_cartesian.x],
        [0, 1, 0, -center_cartesian.y],
        [0, 0, 1, -center_cartesian.z],
        [0, 0, 0, 1]
    ];
    var Rx = [
        [1, 0, 0, 0],
        [0, c / d, -b / d, 0],
        [0, b / d, c / d, 0],
        [0, 0, 0, 1]
    ];
    var Ry = [
        [d, 0, -a, 0],
        [0, 1, 0, 0],
        [a, 0, d, 0],
        [0, 0, 0, 1]
    ];
    const theta = 0.349066; // 20 degrees = 0.349066 radians
    var Rz = [
        [Math.cos(theta), -Math.sin(theta), 0, 0],
        [Math.sin(theta), Math.cos(theta), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ];
    
    for (var i = 0; i < 17; ++i) {
        var current_matrix = [
            [result_cartesian_list[i].x],
            [result_cartesian_list[i].y],
            [result_cartesian_list[i].z],
            [1]
        ];
        var new_matrix = rotatePoint(T, Rx, Ry, Rz, current_matrix);
        result_cartesian_list.push(new Cesium.Cartesian3(new_matrix[0][0], new_matrix[1][0], new_matrix[2][0]));
    }

    var result_point_list = [];
    for (var i = 0; i < 18; ++i) {
        var temp = Cesium.Cartographic.fromCartesian(new Cesium.Cartesian3(result_cartesian_list[i].x, result_cartesian_list[i].y, result_cartesian_list[i].z));
        var temp_lon = parseFloat(Cesium.Math.toDegrees(temp.longitude).toFixed(12));
        var temp_lat = parseFloat(Cesium.Math.toDegrees(temp.latitude).toFixed(12));
        result_point_list.push(new Point(temp_lon, temp_lat, temp.height));
    }
    
    return result_point_list;
}

export const projectEverything = (allKptList, allTreeList, wall, foundationPolyline) => {
    var foundationPoints = foundationPolyline[0].convertHierarchyToPoints();
    var list_of_shadows = [];

    const plane_equation = getPlaneEquationForPoint(foundationPoints[0], foundationPoints[1], foundationPoints[2]);
    const solar_position = calculateSunPositionWrapper();
    const s_vec = shadow_vector(solar_position);

    // normal keepout
    for (var i = 0; i < allKptList.length; ++i) {
        var keepoutPoints = allKptList[i].outlinePolygon.convertHierarchyToPoints();
        var ratio = getRatio(keepoutPoints[0].lon, keepoutPoints[0].lat);
        var s_ratio = [ratio[0] * s_vec[0], ratio[1] * s_vec[1]];
        var shadow = projectPlaneOnAnother(keepoutPoints, foundationPoints, plane_equation, s_ratio, true);
        for (var j = 0; j < shadow.length; ++j) {
            for (var k = 0; k < shadow[j].length; ++k) {
                shadow[j][k].height += 0.01;
            }
            if (shadow[j].length != 0)
                list_of_shadows.push(shadow[j]);
        }
    }

    // tree keepout
    for (var i = 0; i < allTreeList.length; ++i) {
        const center = allTreeList[i].outlinePolygon.centerPoint;
        const radius = allTreeList[i].radius;
        var ratio = getRatio(center.lon, center.lat);
        var s_ratio = [ratio[0] * s_vec[0], ratio[1] * s_vec[1]];
        const treePoints = generateTreePolygon(center, radius, s_ratio, s_vec);
        var shadow = projectPlaneOnAnother(treePoints, foundationPoints, plane_equation, s_ratio);
        for (var j = 0; j < shadow.length; ++j) {
            for (var k = 0; k < shadow[j].length; ++k) {
                shadow[j][k].height += 0.01;
            }
            if (shadow[j].length != 0)
                list_of_shadows.push(shadow[j]);
        }
    }

    // wall keepout
    var wallPoints = [];
    for (var i = 0; i < wall.maximumHeight.length; ++i) {
        wallPoints.push(new Point(wall.positions[i * 2], wall.positions[i * 2 + 1], wall.maximumHeight[i]));
    }
    for (var i = 0; i < wallPoints.length; ++i) {
        var ratio = getRatio(wallPoints[0].lon, wallPoints[0].lat);
        var s_ratio = [ratio[0] * s_vec[0], ratio[1] * s_vec[1]];
        var shadow = projectPlaneOnAnother(wallPoints, foundationPoints, plane_equation, s_ratio, false);
        for (var j = 0; j < shadow.length; ++j) {
            for (var k = 0; k < shadow[j].length; ++k) {
                shadow[j][k].height += 0.01;
            }
            if (shadow[j].length != 0)
                list_of_shadows.push(shadow[j]);
        }
    }

    return list_of_shadows;
}