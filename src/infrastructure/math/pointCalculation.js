import * as Cesium from 'cesium';

import Coordinate from '../point/coordinate';
import Point from '../point/point';
import { calculateSunPositionWrapper } from './sunPositionCalculation';
import { cartesianToPoint, getPlaneEquationForPoint, getPlaneEquationForCartesian, getPlaneLineIntersectPointPosition, rotatePointWrapper, getRatio, shadow_vector } from './shadowHelper';

/**
 * [minPanelTiltAngleOnPitchedRoof description]
 * @param  {Point[]} plane_points  斜屋面顶点集
 * @param  {Number} panelBrng 斜屋面要铺板的朝向 0到360之间
 * @return {Number}           铺板和地面的的最小夹角让板不会陷入斜屋面中
 */
export const minPanelTiltAngleOnPitchedRoof = (plane_points, panelBrng) => {

    const plane_for_point = getPlaneEquationForPoint(plane_points[0], plane_points[1], plane_points[2]);
    const plane_for_cartesian = getPlaneEquationForCartesian(
        Cesium.Cartesian3.fromDegrees(plane_points[0].lon, plane_points[0].lat, plane_points[0].height),
        Cesium.Cartesian3.fromDegrees(plane_points[1].lon, plane_points[1].lat, plane_points[1].height),
        Cesium.Cartesian3.fromDegrees(plane_points[2].lon, plane_points[2].lat, plane_points[2].height)
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
    const new_matrix = rotatePointWrapper(plane_for_cartesian[0], plane_for_cartesian[1], plane_for_cartesian[2], center_cartesian, current_matrix, -theta);
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

    return minPanelTilt * 180 / Math.PI;
}

const getHighAndFixedIndex = (panel_points, p_ratio) => {
    for (var i = 1; i < 4; ++i) {
        var delta_lon = panel_points[0].lon - panel_points[i].lon;
        var delta_lat = panel_points[0].lat - panel_points[i].lat;
        var delta_height = panel_points[0].height - panel_points[i].height;

        if (delta_lon / p_ratio[0] === delta_height && delta_lat / p_ratio[1] === delta_height) {
            if (delta_height < 0) return [0, i];
            else return [i, 0];
        }
    }
    return null;
}

/**
 * [calculatePanelShadowLength description]
 * @param  {Point[]} plane_points  斜屋面顶点集
 * @param  {Point[]} panel_points  太阳能板顶点集 in degrees
 * @param  {Number} panel_al       太阳能板高度角 in degrees
 * @param  {Number} panel_az       太阳能板方位角
 * @return {Number}                阴影长度 in meters
 */
export const calculatePanelShadowLength = (plane_points, panel_points, panel_al, panel_az) => {

    const ratio = getRatio(plane_points[0].lon, plane_points[0].lat);

    const panel_position = [panel_al, panel_az];
    const p_vec = shadow_vector(panel_position);
    const p_ratio = [ratio[0] * p_vec[0], ratio[1] * p_vec[1]];

    const panel_pair = getHighAndFixedIndex(panel_points, p_ratio);
    if (panel_pair === null) {
        console.log("error");
        return null;
    }
    const high_point = panel_points[panel_pair[0]];
    const fix_point = panel_points[panel_pair[1]];

    const solar_position = calculateSunPositionWrapper();
    const s_vec = shadow_vector(solar_position);
    const s_ratio = [ratio[0] * s_vec[0], ratio[1] * s_vec[1]];

    const plane_equation = getPlaneEquationForPoint(plane_points[0], plane_points[1], plane_points[2]);

    const ref_point = new Point(high_point.lon + s_ratio[0], high_point.lat + s_ratio[1], high_point.height - 1);
    const joint = getPlaneLineIntersectPointPosition(high_point, ref_point, plane_equation);
    const joint_cartesian = Cesium.Cartesian3.fromDegrees(
        joint.lon, joint.lat, joint.height
    );
    const fix_cartesian = Cesium.Cartesian3.fromDegrees(
        fix_point.lon, fix_point.lat, fix_point.height
    );

    const delta_x = fix_cartesian.x - joint_cartesian.x;
    const delta_y = fix_cartesian.y - joint_cartesian.y;
    const delta_z = fix_cartesian.z - joint_cartesian.z;

    return Math.sqrt(delta_x * delta_x + delta_y * delta_y + delta_z * delta_z);
}