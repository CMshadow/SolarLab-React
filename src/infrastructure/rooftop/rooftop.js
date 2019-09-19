import React from 'react';
import uuid from 'uuid/v1';
import  * as Cesium from 'cesium';
import Math from '../math/math';
import Coordinate from '../point/coordinate';


/* Polygons: Complex 3D RoofTop of Only Pitched Building */

 /**
   * A foundation polygon
   * @param {string}  [id=null]       unique id of the rooftop collection, automatic
   *                                  generate one if not provided
   * @param {string}  [name=null]     name of the  rooftop collection, using default name 'RoofTop Collection' if not provided
   * @param {Double}  [height=0.0]     the height of the inner points, using default value, 2.0,  if not provided
   * @param {Polygon}   [rooftopCollection= [] ]   A list of Polygon objects, each polygon represents a rooftop ,default empty list                               
   * @param {Boolean} [perPositionHeight=null]  whether to adjust each point
   * @param {Double} [extrudeHeight=true] The distance between the Rooftop and the ground
   *                                  default true
   * @param {Color}   [material=null]  GRBA color, Cesium.Color.WHITE if not
   *                                  provided
   * @param {Color}   [outlineColor=null]  GRBA color, Cesium.Color.Black if not
   *                                  provided
   * @param {Integer}   [outlineWidth=null]  The outline width of Polygon, 4 if not
   *                                  provided
   * @param {Boolean} [show=true]     whether to show the Rooftop,
   *                                  default true
   */

class RoofTop {
  constructor(
    id = null,
    name = null,
    height= null,
    rooftopCollection = null,
    perPositionHeight = true,
    extrudedHeight = null,
    material=null,
    outlineColor= null,
    outlineWidth= null,
    shadow=null,
    show=null
  ){
    this.entityId = id ? id : uuid();
    this.name = name ? name: 'RoofTop Collection';
    this.height = height ? height : 0.0;
    this.rooftopCollection = rooftopCollection ? [...rooftopCollection] : [];
    this.perPositionHeight = perPositionHeight ? perPositionHeight: true;
    this.extrudedHeight = extrudedHeight ? extrudedHeight: 0.0;
    this.material = material ? material: Cesium.Color.WHITE;
    this.outlineColor = outlineColor ? outlineColor : Cesium.Color.BLACK;
    this.outlineWidth = outlineWidth ? outlineWidth : 4;
    this.shadow = shadow ? shadow : Cesium.ShadowMode.ENABLED;
    this.show = show? show: true;
  }

/**
 *  A copy constructor from an existing RoofTop Collection object
  * @param {Polygon}  polygon       the existing RoofTop Collection object to be deep copied
  * @param {string}  [id=null]       unique id of the RoofTop Collection, automatic
  *                                  generate one if not provided
  * @param {string}  [name=null]     name of the RoofTop Collection, using default name if not provided
  * @param {Double}  [height=0.0]     the height of the inner points, using default value, 2.0,  if not provided
  * @param {Polygon}   [rooftopCollection= [] ]   A list of Polygon object, each polygon represents a rooftop ,default empty list                               
  * @param {Color}   [materia=null]  GRBA color, Cesium.Color.WHITE if not
  *                                  provided
  * @param {Boolean} [perPositionHeight=true]  whether to adjust each point
  * @param {Double} [extrudeHeight=0.0] The distance between the Rooftop and the ground
  *                                  default true
  * @param {Boolean} [show=true]     whether to show the Rooftop,
  *                                  default true
* 
 */

  static CopyPolygon (RoofTop, 
    id = null,
    name = null,
    height= null,
    rooftopCollection = null,
    perPositionHeight = true,
    extrudedHeight = null,
    material=null,
    outlineColor= null,
    outlineWidth= null,
    shadow=null,
    show=null) 
    {
      let newID = id ? id : RoofTop.id;
      let newName = name ? name : RoofTop.name;
      let newHeight = height ? height: RoofTop.height;
      let newRooftopCollection = rooftopCollection ? [...rooftopCollection]: RoofTop.rooftopCollection;
      let newPerPositionHeight = perPositionHeight ? perPositionHeight: RoofTop.perPositionHeight;
      let newExtrudedHeight = extrudedHeight ? extrudedHeight: RoofTop.extrudedHeight;
      let newMaterial = material ? material: RoofTop.material;
      let newOutLineColor = outlineColor ? outlineColor : RoofTop.outlineColor;
      let newOutLineWidth = outlineWidth ? outlineWidth : RoofTop.outlineWidth;
      let newShadow = shadow? shadow: true;
      let newShow = show? show: true;
      return new RoofTop(newID, newName, newHeight, newRooftopCollection, newPerPositionHeight, newExtrudedHeight,
        newMaterial, newOutLineColor, newOutLineWidth, newShadow, newShow);
  };


}

