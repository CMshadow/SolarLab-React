import uuid from 'uuid/v1';
import  * as Cesium from 'cesium';

import Point from '../point/point';

class Sphere {

  constructor(
    id = null,
    name = null,
    centerPoint,
    height,
    radius,
    material= null,
    show = null
  ) {
    this.entityId = id ? id : uuid();
    this.name = name ? name: 'Sphere';
    this.centerPoint =
      new Point(centerPoint.lon, centerPoint.lat, height);
    this.radius = radius ? radius : 1
    this.material = material ? material: Cesium.Color.FORESTGREEN ;
    this.show = show? show: true;
  }

  static fromSphere (
    sphere,
    id = null,
    name = null,
    centerPoint = null,
    height= null,
    radius = null,
    material=null,
    show=null
  ){
    const newID = id ? id : sphere.id;
    const newName = name ? name : sphere.name;
    const newCenterPoint =
      centerPoint ? centerPoint : sphere.centerPoint
    const newHeight = height ? height : sphere.centerPoint.height
    const newRadius = radius ? radius : sphere.radius;
    const newMaterial = material ? material: sphere.material;
    const newShow = show? show: true;
    return new Sphere(
      newID, newName, newCenterPoint, newHeight, newRadius, newMaterial, newShow
    );
  };

}
export default Sphere;
