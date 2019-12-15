import uuid from 'uuid/v1';
import  * as Cesium from 'cesium';

import Polygon from './Polygon';

class Shadow extends Polygon{

  constructor(
    id = null,
    name = null,
    hierarchy = null,
    perPositionHeight = null,
    material= null,
    shadow = null,
    show = null,
  ) {
    super(
      id, name || 'Shadow', null, hierarchy, perPositionHeight, null, material,
      null, null, shadow, show,
    );
    this.extrudedHeight = null;
  }

  static copyShadow (
    polygon,
    id = null,
    name = null,
    hierarchy = null,
    perPositionHeight = true,
    material=null,
    shadow=null,
    show=null,
  ) {
    const newID = id ? id : polygon.id;
    const newName = name ? name : polygon.name;
    const newHierarchy = hierarchy ? [...hierarchy]: polygon.hierarchy;
    const newPerPositionHeight =
      perPositionHeight ?
      perPositionHeight:
      polygon.perPositionHeight;
    const newMaterial = material ? material: polygon.material;
    const newShadow = shadow? shadow: true;
    const newShow = show? show: true;
    return new Shadow(
      newID, newName, newHierarchy, newPerPositionHeight, newMaterial,
      newShadow, newShow
    );
  };
}
export default Shadow;
