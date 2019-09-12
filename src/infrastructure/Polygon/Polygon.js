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
   * @param {Color}   [materia=null]  GRBA color, Cesium.Color.WHITE if not
   *                                  provided
   * @param {Boolean} [perPosition=null]  whether to adjust each point
   * @param {Double} [extrudeHeight=true] The distance between the foudation and the ground
   *                                  default true
   * @param {Boolean} [show=true]     whether to show the polygon,
   *                                  default true
   */

class Polygon {
    constructor(
        id = null,
        name = null,
        height= 0.0,
        hierarchy = [],
        perPosition = true,
        extrudeHeight = 0.0,
        materia=null,
        shadow=Cesium.ShadowMode.ENABLED
    ) {
        this.entityId = id ? id : uuid();
        this.name = name ? name: 'Polygon_Foundation';
        this.perPosition = perPosition ? perPosition: true;
        this.extrudeHeight = extrudeHeight ? extrudeHeight: 0.0;
        this.materia = materia ? materia: Cesium.Color.WHITE;
        this.shadow = shadow ? shadow : Cesium.ShadowMode.ENABLED;
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
   * @param {Boolean} [perPosition=true]  whether to adjust each point
   * @param {Double} [extrudeHeight=0.0] The distance between the foudation and the ground
   *                                  default true
   * @param {Boolean} [show=true]     whether to show the polygon,
   *                                  default true
 * 
 */

static fromPolygon (polygon, 
    id = polygon.entityId, 
    name = null, 
    height = 0.0,
    hierarchy = null,
    material = null,
    perPosition = true,
    extrudeHeight = 0.0,
    show = true) {

      let newHierarchy = [...polygon.hierarchy] ? polygon.hierarchy: [] ;
      let newName = name ? name : polygon.name;
      let newHeight = height ? height: polygon.height;
      let newMaterial = material ? material: polygon.material;
      let newPerPosition = perPosition? perPosition: true;
      let newExtrudeHeight = extrudeHeight? extrudeHeight: 0.0;
      let newShow = show? show: true;
      return new Polygon(id, newName, newHeight, newHierarchy, newMaterial, 
        newPerPosition, newExtrudeHeight, newShow );
  };

/**
   * get the coordinates array of the foudation polygon
   * @return {[Float, Float ...]} An array of coordinates that represents 
   * all positions of points the foundaion polgon contains
   */

  getFoundationCoordinatesArray = () => (this.height);

 /**
   * set the height of polygon foundatoin
   *
   */
  setHeight = (newHeight) => {
    this.height = newHeight;
  };

  getProps = () => {
    return {
      id: this.id, 
      height: this.height,
      hierarchy: this.hierarchy,
      material: this.materia,
      perPosition: this.perPosition,
      extrudeHeight: this.extrudeHeight,
      show: this.show}
  }

  /**
   * change the color of the polygon
   * @param {Color} newColor new Cesium.Color or RGBA color
   */
  setColor = (newColor) => {
    this.color = newColor;
  };

/**
   *  set the props.show of the foundation polygon
   * @param {Boolean} isShowed true: show the foundation polygon, otherwise hide it.
   */

  foundation_Toggle_Handler = (isShowed) => (this.show = isShowed);

}
export default Polygon;