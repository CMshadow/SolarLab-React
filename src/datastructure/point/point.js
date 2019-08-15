import { Color } from 'cesium';
import uuid from 'uuid/v1';

import Coordinate from './coordinate';

/**
 * A point, extended from Coordinate
 * @extends Coordinate
 */
class Point extends Coordinate {

  /**
   * Point constructor
   * @param {number}       lon          the lontitude of the coordinate, fixed
   *                                    to 12 decimalplaces
   * @param {number}       lat          the latitude of the coordinate, fixed
   *                                    to 12 decimalplaces
   * @param {number}       height       the height of the coordinate, fixed
   *                                    to 12 decimalplaces
   * @param {string}       [id=null]    unique id of the point, automatic
   *                                    generate one if not provided
   * @param {string}       [name=null]  name of the point, automatic generate
   *                                    one if not provided
   * @param {Cesium.Color} [color=null] GRBA color, Cesium.Color.WHITE if not
   *                                    provided
   * @param {int}          [size=null]  the size of the point, 15 if not
   *                                    provided
   * @param {bool}         [show=true]  whether to show the point, default true
   */
  constructor (
    lon, lat, height, id=null, name=null, color=null, size=null, show=true
  ) {
    super (lon, lat, height);
    this.entityId = id ? id : uuid();
    this.name = name ? name : 'vertex';
    this.color = color ? color : Color.WHITE;
    this.pixelSize = size ? size : 15;
    this.show = show;
  }

  /**
   * create a Point object from a Coordinate object
   * @param  {Coordinate}    coordinate   the Coordinate object
   * @param  {string}        [id=null]    unique id of the point, automatic
   *                                      generate one if not provided
   * @param  {string}        [name=null]  name of the point, automatic generate
   *                                      one if not provided
   * @param  {Cesium.Color}  [color=null] GRBA color, Cesium.Color.WHITE if not
   *                                      provided
   * @param  {int}           [size=null]  the size of the point, 15 if not
   *                                      provided
   * @param  {bool}          [show=true]  whether to show the point, default true
   * @return {Point}                      a Point object
   */
  static fromCoordinate(
    coordinate, id=null, name=null, color=null, size=null, show=true
  ) {
    return new Point(
      coordinate.lon, coordinate.lat, coordinate.height, id, name, color, size,
      show);
  }

}

export default Point;
