import {
  Color
} from 'cesium';
import uuid from 'uuid/v1';

import Coordinate from './coordinate';

/**
 * A point, extended from Coordinate
 * @extends Coordinate
 */
class Point extends Coordinate {

  /**
   * Point constructor
   * @param {number}  lon           the lontitude of the coordinate, fixed
   *                                to 12 decimalplaces
   * @param {number}  lat           the latitude of the coordinate, fixed
   *                                to 12 decimalplaces
   * @param {number}  height        the height of the coordinate, fixed
   *                                to 12 decimalplaces
   * @param {number}  [hOffset=0]   the height offset beyond its original
   *                                height, default 0
   * @param {string}  [id=null]     unique id of the point, automatic
   *                                generate one if not provided
   * @param {string}  [name=null]   name of the point, automatic generate
   *                                one if not provided
   * @param {Color}   [color=null]  GRBA color, Cesium.Color.WHITE if not
   *                                provided
   * @param {int}     [size=null]   the size of the point, 15 if not
   *                                provided
   * @param {bool}    [show=true]   whether to show the point, default true
   */
  constructor(
    lon, lat, height, hOffset = null, id = null, name = null, color = null,
    size = null, show = true
  ) {
    super(lon, lat, height);
    this.heightOffset = hOffset ? hOffset : 0;
    this.entityId = id ? id : uuid();
    this.name = name ? name : 'vertex';
    this.color = color ? color : Color.WHITE;
    this.pixelSize = size ? size : 15;
    this.show = show;
  }

  /**
   * A copy constructor from an existing Point object
   * @param  {Point}  point        the existing Polyline object to be
   *                               copied
   * @param  {Number} [hOffset=0]  the height offset beyond its original height,
   *                               copy the existing one if not provided
   * @param  {string} [id=null]    unique id of the polyline, automatic
   *                               generate one if not provided
   * @param  {string} [name=null]  name of the polyline, copy the existing
   *                               one if not provided
   * @param  {Color}  [color=null] GRBA color, copy the existing one if
   *                               not provided
   * @param  {int}    [size=null]  size of the point, copy the
   *                               existing one if not provided
   * @param  {Boolean}[show=true]  whether to show the polyline, copy the
   *                               existing one if not provided
   * @return {Point}               new Point object
   */
  static fromPoint (
    point, hOffset = null, id = null, name = null, color = null, size = null,
    show = true
  ) {
      const newLon = point.lon;
      const newLat = point.lat;
      const newHeight = point.height;
      const newHOffset = hOffset ? hOffset : point.heightOffset;
      const newName = name ? name : point.name;
      const newColor = color ? color : point.color;
      const newShow = show ? show : point.show;
      const newPixelSize = size ? size : point.pixelSize;
      return new Point (newLon, newLat, newHeight, newHOffset, id, newName,
        newColor, newPixelSize, newShow);
    }


  /**
   * create a Point object from a Coordinate object
   * @param  {Coordinate}    coordinate   the Coordinate object
   * @param  {number}        [hOffset=0]  the height offset beyond its original
   *                                      height, default 0
   * @param  {string}        [id=null]    unique id of the point, automatic
   *                                      generate one if not provided
   * @param  {string}        [name=null]  name of the point, automatic generate
   *                                      one if not provided
   * @param  {Color}         [color=null] GRBA color, Cesium.Color.WHITE if not
   *                                      provided
   * @param  {int}           [size=null]  the size of the point, 15 if not
   *                                      provided
   * @param  {bool}          [show=true]  whether to show the point, default
   *                                      true
   * @return {Point}                      a Point object
   */
  static fromCoordinate(
    coordinate, hOffset = null, id = null, name = null, color = null, size = null, show = true
  ) {
    return new Point(
      coordinate.lon, coordinate.lat, coordinate.height, hOffset, id, name,
      color, size, show);
  }

  /**
   * get the coordinate of the point with heightOffset
   * @param  {Boolean}  [toArray=false] whether to get the coordinate as an
   *                                    array or Object
   * @return {number[]}                 A array of three number in the order of
   *                                    [lon, lat, height]
   * or
   * @return {Object}                   An Object in the form {lon, lat, height}
   */
  getCoordinate = (toArray = false) => {
    if (toArray) {
      return [this.lon, this.lat, this.height + this.heightOffset];
    } else {
      return {
        lon: this.lon,
        lat: this.lat,
        height: this.height + this.heightOffset
      };
    }
  }
}

export default Point;
