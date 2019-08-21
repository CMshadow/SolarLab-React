import {
  Color
} from 'cesium';
import uuid from 'uuid/v1';

import Point from '../point/point';

class Polyline {

  /**
   * A polyline
   * @param {Point}   [points=null]   A list of Point objects, default empty
   * @param {string}  [id=null]       unique id of the polyline, automatic
   *                                  generate one if not provided
   * @param {string}  [name=null]     name of the polyline, automatic generate
   *                                  one if not provided
   * @param {Color}   [color=null]    GRBA color, Cesium.Color.WHITE if not
   *                                  provided
   * @param {int}     [width=null]    width of the polyline, default 4
   * @param {Boolean} [show=true]     whether to show the polyline,
   *                                  default true
   */
  constructor (points = null, id = null, name = null, color = null,
    width = null, show = true
  ) {
    this.points = points ? points : [];
    this.entityId = id ? id : uuid();
    this.name = name ? name : 'polyline';
    this.color = color ? color : Color.WHITE;
    this.show = show;
    this.width = width ? width : 4;
  }

  /**
   * A copy constructor from an existing Polyline object
   * @param  {Polyline} polyline      the existing Polyline object to be
   *                                  copied
   * @param  {string}   [id=null]     unique id of the polyline, automatic
   *                                  generate one if not provided
   * @param  {string}   [name=null]   name of the polyline, copy the existing
   *                                  one if not provided
   * @param  {.Color}   [color=null]  GRBA color, copy the existing one if
   *                                  not provided
   * @param  {int}      [width=null]  width of the polyline, copy the
   *                                  existing one if not provided
   * @param  {Boolean}  [show=true]   whether to show the polyline, copy the
   *                                  existing one if not provided
   * @return {Polyline}               new Polyline object
   */
  static fromPolyline (polyline, id = null, name = null, color = null,
    width = null, show = true
  ) {
      const newPoints = polyline.points;
      const newName = name ? name : polyline.name;
      const newColor = color ? color : polyline.color;
      const newShow = show ? show : polyline.show;
      const newWidth = width ? width : polyline.width;
      return new Polyline (newPoints, id, newName, newColor, newWidth, newShow);
    }

  /**
   * the number of points of the polyline
   * @return {int} the number of points of the polyline
   */
  get length () {
    return this.points.length;
  }

  /**
   * A a point in a specific position of the polyline
   * @param {number}  position the index position of the point to be added
   * @param {Point}   point    the Point object to be added
   */
  addPoint = (position, point) => {
    if (point instanceof Point) {
      this.points.splice(position, 0, point);
    } else {
      throw new Error('Adding object is not a Point object');
    }
  }

  /**
   * delete a point in a specific position of the polyline
   * @param  {number} position the index position of the point to be deleted
   * @return {Point}           the Point object being deleted
   */
  deletePoint = (position) => {
    if (position < this.length) {
      const deletedPoint = this.points.splice(position, 1);
      return deletedPoint[0];
    } else {
      throw new Error('The index is beyond Polyline length');
    }
  }

  /**
   * get a coordinates array of all points in the polyline
   * @param  {Boolean}    [flat=true] whether return a flat array of 2D array
   * @return {number[]}               a flat array of all points' coordinates,
   *                                  i.e. [lon1, lat1, h1, lon2, lat2, h2, ...]
   * or
   * @return {[number[]]}             a 2D array of all points' coordinates, i.e.
   *                                  [[lon1, lat1, h1], [lon2, lat2, h2], ...]
   */
  getPointsCoordinatesArray = (flat = true) => {
    let CoordinatesArray = [];
    if (flat) {
      this.points.map(point => {
        return CoordinatesArray = CoordinatesArray.concat(
          point.getCoordinate(true)
        );
      });
      return CoordinatesArray;
    } else {
      this.points.map(point => {
        return CoordinatesArray.push(point.getCoordinate(true));
      });
      return CoordinatesArray;
    }
  }
}

export default Polyline;
