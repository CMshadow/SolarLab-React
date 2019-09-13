import React from 'react';
import uuid from 'uuid/v1';
import  * as Cesium from 'cesium';

import Coordinate from '../point/coordinate';


/* 
    Polygon: Basic 3D-foundations of both Flat/Pitched Roof
*/

  /**
   * A foundation polygon
   * @param {string}  [id=null]       unique id of the polygon, automatic
   *                                  generate one if not provided
   * @param {string}  [name=null]     name of the polygon, using default name if not provided
   * @param {Double}  [height=0.0]     the height of the fouddation, using default value, 0.0,  if not provided
   * @param {Coordinate}   [hierarchy= [] ]   A list of Point Coordinate object, default empty list                               
   * @param {Boolean} [perPositionHeight=null]  whether to adjust each point
   * @param {Double} [extrudeHeight=true] The distance between the foudation and the ground
   *                                  default true
   * @param {Color}   [material=null]  GRBA color, Cesium.Color.WHITE if not
   *                                  provided
   * @param {Color}   [outlineColor=null]  GRBA color, Cesium.Color.Black if not
   *                                  provided
   * @param {Integer}   [outlineWidth=null]  The outline width of Polygon, 4 if not
   *                                  provided
   * @param {Boolean} [show=true]     whether to show the polygon,
   *                                  default true
   */

class Polygon {
  constructor(
    id = null,
    name = null,
    height= null,
    hierarchy = null,
    perPositionHeight = true,
    extrudedHeight = null,
    material=null,
    outlineColor= null,
    outlineWidth= null,
    shadow=null,
    show=null
  ) {
    this.entityId = id ? id : uuid();
    this.name = name ? name: 'Polygon_Foundation';
    this.height = height ? height : 0.0;
    this.hierarchy = [...hierarchy] ? hierarchy : [];
    this.perPositionHeight = perPositionHeight ? perPositionHeight: true;
    this.extrudedHeight = extrudedHeight ? extrudedHeight: 0.0;
    this.material = material ? material: Cesium.Color.WHITE;
    this.outlineColor = outlineColor ? outlineColor : Cesium.Color.BLACK;
    this.outlineWidth = outlineWidth ? outlineWidth : 4;
    this.shadow = shadow ? shadow : Cesium.ShadowMode.ENABLED;
    this.show = show? show: true;
  }


/**
 *  A copy constructor from an existing Polyline object
  * @param {Polygon}  polygon       the existing polygon object to be deep copied
  * @param {string}  [id=null]       unique id of the polygon, automatic
  *                                  generate one if not provided
  * @param {string}  [name=null]     name of the polygon, using default name if not provided
  * @param {Double}  [height=0.0]     the height of the fouddation, using default value, 0.0,  if not provided
  * @param {Coordinate}   [hierarchy= [] ]   A list of Point Coordinate object, default empty list                               
  * @param {Color}   [materia=null]  GRBA color, Cesium.Color.WHITE if not
  *                                  provided
  * @param {Boolean} [perPositionHeight=true]  whether to adjust each point
  * @param {Double} [extrudeHeight=0.0] The distance between the foudation and the ground
  *                                  default true
  * @param {Boolean} [show=true]     whether to show the polygon,
  *                                  default true
* 
 */

static CopyPolygon (polygon, 
  id = null,
  name = null,
  height= null,
  hierarchy = null,
  perPositionHeight = true,
  extrudedHeight = null,
  material=null,
  outlineColor= null,
  outlineWidth= null,
  shadow=null,
  show=null) 
  {
    let newID = id ? id : polygon.id;
    let newName = name ? name : polygon.name;
    let newHeight = height ? height: polygon.height;
    let newHierarchy = hierarchy ? hierarchy: polygon.hierarchy;
    let newPerPositionHeight = perPositionHeight ? perPositionHeight: polygon.perPositionHeight;
    let newExtrudedHeight = extrudedHeight ? extrudedHeight: polygon.extrudedHeight;
    let newMaterial = material ? material: polygon.material;
    let newOutLineColor = outlineColor ? outlineColor : polygon.outlineColor;
    let newOutLineWidth = outlineWidth ? outlineWidth : polygon.outlineWidth;
    let newShadow = shadow? shadow: true;
    let newShow = show? show: true;
    return new Polygon(newID, newName, newHeight, newHierarchy, newPerPositionHeight, newExtrudedHeight,
      newMaterial, newOutLineColor, newOutLineWidth, newShadow, newShow);
};

/**
   * get the coordinates array of the foudation polygon
   * @return {Number[lon1, lat1, height1, lon2, lat2, height2 ...]} An array of coordinates that represents, 
   *                                                                must be at least 3 mor multiples of 3
   * all positions of points the foundaion polgon contains
   */

  getFoundationCoordinatesArray = () => (this.hierarchy);

 /**
   * set the height of polygon foundatoin
   * @param {Float} newHeight the height of the foundation polygon
   */
  setHeight = (newHeight) => {
    this.height = newHeight;
  };


  /**
   * change the color of the polygon
   * @param {Color} newColor new Cesium.Color or RGBA color
   */
  setColor = (newColor) => {
    this.color = newColor;
  };

}
export default Polygon;