import * as Cesium from 'cesium';

import Coordinate from '../point/coordinate';
import Point from '../point/point';
import { cartesianToPoint, getPlaneEquationForPoint, getPlaneEquationForCartesian, getPlaneLineIntersectPointPosition, rotatePointWrapper } from './shadowHelper';

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