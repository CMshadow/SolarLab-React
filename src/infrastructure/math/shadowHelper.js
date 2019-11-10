import * as turf from '@turf/turf';

import Point from '../point/point';
import Polyline from '../../infrastructure/line/polyline';
import { calculateSunPositionWrapper } from './sunPositionCalculation';
import * as Cesium from 'cesium';
import * as martinez from 'martinez-polygon-clipping';

export const getPlaneEquation = (point1, point2, point3) => {

    var a = (point2.lat - point1.lat) * (point3.height - point1.height) -
            (point2.height - point1.height) * (point3.lat - point1.lat);

    var b = (point2.height - point1.height) * (point3.lon - point1.lon) -
            (point2.lon - point1.lon) * (point3.height - point1.height);

    var c = (point2.lon - point1.lon) * (point3.lat - point1.lat) -
            (point2.lat - point1.lat) * (point3.lon - point1.lon);

    var d = 0 - (a * point1.lon + b * point1.lat + c * point1.height);

    return [a, b, c, d]; //ax+by+cz+d = 0
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

    console.log(l1 + " " + l2 + " " + l3);
    console.log(m1 + " " + m2 + " " + m3);
    console.log(a + " " + b + " " + c + " " + d);

    if (l1 == 0 && l2 == 0) {
        var z = 0 - (a * m1 + b * m2 + d) / c;
        return new Point(m1, m2, z);
    }

    var x = ((b * l2 / l1 + c * l3 / l1) * m1 - b * m2 - c * m3 - d) / (a + b * l2 / l1 + c * l3 / l1);
    var y = (x - m1) * l2 / l1 + m2;
    var z = (x - m1) * l3 / l1 + m3;

    return new Point(x, y, z);
}

export const getRatio = (lon, lat) => {
    var unit_lon = lon + 0.001;
    var unit_lat = lat + 0.001;
    var originPoint = new Cesium.Cartesian3.fromDegrees(lon, lat, 0.0);
    var newLongPoint = new Cesium.Cartesian3.fromDegrees(unit_lon, lat, 0.0);
    var newLatPoint = new Cesium.Cartesian3.fromDegrees(lon, unit_lat, 0.0);
    var ratio_Longitude = Cesium.Cartesian3.distance(originPoint, newLongPoint);
    var ratio_Latitude = Cesium.Cartesian3.distance(originPoint, newLatPoint);
    return [0.0004 / ratio_Longitude, 0.0004 / ratio_Latitude];
}

export const getShadowLineForPoint = (point, s_ratio, plane_equation) => {
    var vertical_point = new Point(point.lon, point.lat, 0);
    var shadow_x = point.lon + s_ratio[0] * point.height;
    var shadow_y = point.lat + s_ratio[1] * point.height;
    console.log("point.lon: " + point.lon + "; point.lat: " + point.lat + "; point.height: " + point.height);
    console.log("s_ratio[0]: " + s_ratio[0] + "; s_ratio[1]: " + s_ratio[1]);
    var shadow_point = new Point(shadow_x, shadow_y, 0);
    console.log("shadow_point");
    console.log(shadow_point);
    var plane_point1 = getPlaneLineIntersectPointPosition(point, vertical_point, plane_equation);
    var plane_point2 = getPlaneLineIntersectPointPosition(point, shadow_point, plane_equation);
    return [plane_point1, plane_point2]
}

export const getParallelogramsForPlane = (point_list, s_vec, plane_equation) => {
    if (point_list.length <= 1) return null;
    var point_pair_list = [];
    var ratio = getRatio(point_list[0].lon, point_list[0].lat);
    var s_ratio = [ratio[0] * s_vec[0], ratio[1] * s_vec[1]];
    for (var i = 0; i < point_list.length; ++i) {
        point_pair_list.push(getShadowLineForPoint(point_list[i], s_ratio, plane_equation));
    }
    var parallelograms = [];
    for (var i = 0; i < point_pair_list.length - 1; ++i) {
        var parallelogram = [];
        parallelogram.push(point_pair_list[i][0]);
        parallelogram.push(point_pair_list[i][1]);
        parallelogram.push(point_pair_list[i+1][1]);
        parallelogram.push(point_pair_list[i + 1][0]);
        parallelograms.push(parallelogram);
    }
    return parallelograms
}

export const unionPolygons = (point_list1, point_list2, plane_equation) => {
    const polyline1 = new Polyline(point_list1, false);
    const polyline2 = new Polyline(point_list2, false);
    console.log("polyline1.makeGeoJSON():");
    console.log(polyline1.makeGeoJSON());
    var union = turf.union(polyline1.makeGeoJSON(),
        polyline2.makeGeoJSON()).geometry.coordinates;
    var result_point_list = [];
    for (var i = 0; i < union.length; ++i) {
        var height = getPlaneLineIntersectPointPosition(
            new Point(union[i][0], union[i][1], 0),
            new Point(union[i][0], union[i][1], 5),
            plane_equation
        );
        result_point_list.push(new Point(union[i][0], union[i][1], height));
    }
    return result_point_list;
}

export const intersectPolygons = (point_list1, point_list2, plane_equation) => {
    const polyline1 = new Polyline(point_list1, false);
    const polyline2 = new Polyline(point_list2, false);
    var intersection = martinez.intersection(
        polyline1.makeGeoJSON().geometry.coordinates,
        polyline2.makeGeoJSON().geometry.coordinates
    )[0];
    var result_point_list = [];
    for (var i = 0; i < intersection.length; ++i) {
        var height = getPlaneLineIntersectPointPosition(
            new Point(intersection[i][0], intersection[i][1], 0),
            new Point(intersection[i][0], intersection[i][1], 5),
            plane_equation
        );
        result_point_list.push(new Point(intersection[i][0], intersection[i][1], height));
    }
    return result_point_list;
}

export const projectPlaneOnAnother = (point_list1, point_list2) => {
    if (point_list1.length < 3 || point_list2.length < 3) return null;
    const plane_equation = getPlaneEquation(point_list1[0], point_list1[1], point_list1[2]);
    const s_vec = calculateSunPositionWrapper()
    var parallelograms = getParallelogramsForPlane(point_list1, s_vec, plane_equation);
    console.log("parallelograms");
    console.log(parallelograms);
    var union = parallelograms[0];
    for (var i = 1; i < parallelograms.length; ++i) {
        union = unionPolygons(union, parallelograms[i], plane_equation);
    }
    var result_shadow = intersectPolygons(union, point_list2);
    return result_shadow;
}