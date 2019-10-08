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
   * @param {number}  lon           the lontitude of the coordinate, fixed
   *                                to 12 decimalplaces
   * @param {number}  lat           the latitude of the coordinate, fixed
   *                                to 12 decimalplaces
   * @param {number}  height        the height of the coordinate, fixed
   *                                to 3 decimalplaces
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
   * @param {bool}    [render=true] whether to render the point, default true
   */
  constructor(
    lon, lat, height, hOffset = null, id = null, name = null, color = null,
    size = null, show = true, render = true
  ) {
    super(lon, lat, height);
    this.heightOffset = hOffset ? hOffset : 0;
    this.entityId = id ? id : uuid();
    this.name = name ? name : 'vertex';
    this.color = color ? color : Color.WHITE;
    this.pixelSize = size ? size : 15;
    this.show = show;
    this.render = render;
  };

  /**
   * change the color of the point
   * @param {Color} newColor new Cesium.Color or RGBA color
   */
  setColor = (newColor) => {
    this.color = newColor;
  };

  /**
   * A copy constructor from an existing Point object
   * @param  {Point} point            the existing Point object to be copied
   * @param  {number} [lon=null]      overwrite lontitude value
   * @param  {number} [lat=null]      overwrite latitude value
   * @param  {number} [height=null]   overwrite height value
   * @param  {number} [offset=null]   overwrite offset value
   * @param  {string} [id=null]       overwrite id value
   * @param  {string} [name=null]     overwrite name value
   * @param  {Color} [color=null]     overwrite color value
   * @param  {bool} [show=null]       overwrite show/hide value
   * @param  {int} [pixelSize=null]   overwrite point size value
   * @param  {bool} [render=null]     overwrite render/no render value
   * @return {Point}                  new Point object
   */
  static fromPoint (
    point, lon = null, lat = null, height = null, offset = null, id = null,
    name = null, color = null, show = null, pixelSize = null, render = null
  ) {
      const newLon = lon ? lon : point.lon;
      const newLat = lat ? lat : point.lat;
      const newHeight = height ? height : point.height;
      const newHOffset = offset ? offset : point.heightOffset;
      const newId = id ? id : point.entityId
      const newName = name ? name : point.name;
      const newColor = color ? color : point.color;
      const newShow = render !== null ? show : point.show;
      const newPixelSize = pixelSize ? pixelSize : point.pixelSize;
      const newRender = render !== null ? render : point.render;
      return new Point (newLon, newLat, newHeight, newHOffset, newId, newName,
        newColor, newPixelSize, newShow, newRender);
    };

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
   * @param {bool}    [render=true] whether to render the point, default true
   * @return {Point}                      a Point object
   */
  static fromCoordinate(
    coordinate, hOffset = null, id = null, name = null, color = null,
    size = null, show = true, render = true
  ) {
    return new Point(
      coordinate.lon, coordinate.lat, coordinate.height, hOffset, id, name,
      color, size, show, render);
  };

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
  };
}

export default Point;
