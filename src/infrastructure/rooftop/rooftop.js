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
   * @param {Polygon}   [rooftopCollection= [] ]   A list of Polygon objects, each polygon represents a rooftop ,default empty list
   *                                  provided
   * @param {Boolean} [show=true]     whether to show the Rooftop,
   *                                  default true
   */

class RoofTop {
  constructor(
    id = null,
    name = null,
    rooftopCollection = null,
    show=null,
    rooftopExcludeStb = null
  ){
    this.entityId = id ? id : uuid();
    this.name = name ? name: 'RoofTop Collection';
    this.rooftopCollection = rooftopCollection ? [...rooftopCollection] : [];
    this.show = show? show: true;
    this.rooftopExcludeStb = rooftopExcludeStb || [];
  }

/**
 *  A copy constructor from an existing RoofTop Collection object
  * @param {Polygon}  polygon       the existing RoofTop Collection object to be deep copied
  * @param {string}  [id=null]       unique id of the RoofTop Collection, automatic
  *                                  generate one if not provided
  * @param {string}  [name=null]     name of the RoofTop Collection, using default name if not provided
  * @param {Polygon}   [rooftopCollection= [] ]   A list of Polygon object, each polygon represents a rooftop ,default empty list
  * @param {Boolean} [show=true]     whether to show the Rooftop,
  *                                  default true
 */

  static CopyPolygon (RoofTop,
    id = null,
    name = null,
    rooftopCollection = null,
    show=null,
    rooftopExcludeStb = null
  )
    {
      let newID = id ? id : RoofTop.id;
      let newName = name ? name : RoofTop.name;
      let newRooftopCollection =
        rooftopCollection ? [...rooftopCollection] : RoofTop.rooftopCollection;
      let newShow = show? show: true;
      const newRooftopExcludeStb =
        rooftopExcludeStb || RoofTop.rooftopExcludeStb
      return new RoofTop(
        newID, newName, newRooftopCollection, newShow, newRooftopExcludeStb
      );
  };

  /**
   * Add a roof plane to the rooftop collection
   * @param {Roof}  Polygon The Polygon that represent a roof plane
   */
  addRoofPlane = (roof) => {
    this.rooftopCollection.push(roof);
  }
  /**
   * Return all roof planes
   * @param {List of Polygon}  List The list of all Polygons, each polygon represents a roof plane
   */
  getAllRoofTops = () => {
    return this.rooftopCollection;
  }

}

export default RoofTop;
