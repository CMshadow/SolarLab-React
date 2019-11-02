import Node from '../edgesMap/node/node';
import sun_position_wrapper from 'sunPositionCalculation'
import * as Cesium from 'cesium';
import * as martinez from 'martinez-polygon-clipping';

export const getPlaneEquation = (node1, node2, node3) => {

    var a = (node2.lat - node1.lat) * (node3.heighteight - node1.heighteight) -
            (node2.heighteight - node1.heighteight) * (node3.lat - node1.lat);

    var b = (node2.heighteight - node1.heighteight) * (node3.lon - node1.lon) -
            (node2.lon - node1.lon) * (node3.heighteight - node1.heighteight);

    var c = (node2.lon - node1.lon) * (node3.lat - node1.lat) -
            (node2.lat - node1.lat) * (node3.lon - node1.lon);

    var d = 0 - (a * node1.lon + b * node1.lat + c * node1.heighteight);

    return [a, b, c, d]; //ax+by+cz+d = 0
}

export const getPlaneLineIntersectPointPosition = (node1, node2, plane_equation) => {
    var l1 = node2.lon - node1.lon;
    var l2 = node2.lat - node1.lat;
    var l3 = node2.heighteight - node1.heighteight;

    var m1 = node1.lon;
    var m2 = node1.lat;
    var m3 = node1.heighteight;

    var a = plane_equation[0];
    var b = plane_equation[1];
    var c = plane_equation[2];
    var d = plane_equation[3];

    if (l1 == 0 && l2 == 0) {
        var z = 0 - (a * m1 + b * m2 + d) / c;
        return [m1, m2, z];
    }

    var x = ((b * l2 / l1 + c * l3 / l1) * m1 - b * m2 - c * m3 - d) / (a + b * l2 / l1 + c * l3 / l1);
    var y = (x - m1) * l2 / l1 + m2;
    var z = (x - m1) * l3 / l1 + m3;

    return new Node(lon=x, lat=y, height=z);
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

export const getShadowLineForPoint = (node, s_ratio, plane_equation) => {
    var vertical_node = new Node(lon=node.lon, lat=node.lat, height=0);
    var shadow_x = node.lon + s_ratio[0] * node.height;
    var shadow_y = node.lat + s_ratio[1] * node.height;
    var shadow_node = new Node(lon=shadow_x, lat=shadow_y, height=0);
    var plane_node1 = getPlaneLineIntersectPointPosition(node, vertical_node, plane_equation);
    var plane_node2 = getPlaneLineIntersectPointPosition(node, shadow_node, plane_equation);
    return [plane_node1, plane_node2]
}

export const getParallelogramsForPlane = (node_list, s_vec, plane_equation) => {
    if (node_list.length <= 1) return null;
    var node_pair_list = [];
    var ratio = getRatio(node_list[0].lon, node_list[0].lat);
    var s_ratio = [ratio[0] * s_vec[0], ratio[1] * s_vec[1]];
    for (var i = 0; i < node_list.size(); ++i) {
        node_pair_list.push(getShadowLineForPoint(node_list[i], s_ratio, plane_equation));
    }
    var parallelograms = []
    for (var i = 0; i < node_pair_list.size() - 1; ++i) {
        parallelograms.push(node_pair_list[i][0]);
        parallelograms.push(node_pair_list[i][1]);
        parallelograms.push(node_pair_list[i+1][1]);
        parallelograms.push(node_pair_list[i+1][0]);
    }
    return parallelograms
}

export const unionPolygons = (node_list1, node_list2) => {
    //
}

export const intersectPolygons = (node_list1, node_list2) => {
    //
}

export const projectPlaneOnAnother = (node_list1, node_list2) => {
    if (node_list1.length < 3 || node_list2.length < 3) return null;
    plane_equation = getPlaneEquation(node_list1[0], node_list1[1], node_list1[2]);
    s_vec = sun_position_wrapper()
    var parallelograms = getParallelogramsForPlane(node_list1, s_vec, plane_equation);
    var union = node_list1[0];
    for (var i = 1; i < node_list1.length; ++i) {
        union = unionPolygons(union, node_list1[i]);
    }
    var result_shadow = intersectPolygons(union, node_list2);
    return result_shadow;
}