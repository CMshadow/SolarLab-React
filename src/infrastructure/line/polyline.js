import * as Cesium from 'cesium';
import uuid from 'uuid/v1';
import * as turf from '@turf/turf';
import simplepolygon from 'simplepolygon';

import errorNotification from '../../components/ui/Notification/ErrorNotification';
import Point from '../point/point';
import Coordinate from '../point/coordinate';

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
  constructor (
    points = null, id = null, name = null, color = null, width = null,
    show = true
  ) {
    this.points = points ? points : [];
    this.entityId = id ? id : uuid();
    this.name = name ? name : 'polyline';
    this.color = color ? color : Cesium.Color.WHITE;
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
  static fromPolyline (
    polyline, id = polyline.entityId, name = null, color = null, width = null,
    show = true
  ) {
    const newPoints = polyline.points.map(elem => {
      return Point.fromPoint(elem);
    });
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

  get polylineLength () {
    const segmentDist = this.getSegmentDistance();
    return segmentDist.reduce((a,b) => a + b, 0);
  }

  get polylineArea () {
    return turf.area(turf.polygon(this.makeGeoJSON().geometry.coordinates));
  }

  /**
   * change the color of the polyline
   * @param {Color} newColor new Cesium.Color or RGBA color
   */
  setColor = (newColor) => {
    this.color = newColor;
  };

  /**
   * Add a point in a specific position of the polyline
   * @param {number}  position the index position of the point to be added
   * @param {Point}   point    the Point object to be added
   */
  addPoint = (position, point) => {
    this.points.splice(position, 0, point);
  }

  /**
   * auto adjust the adding point to be precisly located on the polyline
   * @param {number} position the index position of the point to be added
   * @param {Point}  point    the Point object to be added
   */
  addPointPrecision = (position, point) => {
    const newCoordinate = this.preciseAddPointPosition(position, point);
    const newPoint = Point.fromPoint(point);
    newPoint.setCoordinate(
      newCoordinate.lon, newCoordinate.lat, newCoordinate.height
    );
    this.points.splice(position, 0, newPoint);
  }

  /**
   * Add a point at the tail of the polyline
   * @param {Point}   point    the Point object to be added
   */
  addPointTail = (point) => {
    this.addPoint(this.length, point);
  }

  /**
   * Find the index of the new point to be added according to the mouse click
   * position
   * @param  {Carteisan3} cartesian3 mouse click position
   * @return {Int}                   the index of the new point to be added
   */
  determineAddPointPosition = (cartesian3) => {
    const cor = Coordinate.fromCartesian(cartesian3);
    const polylineBrngArray = this.getSegmentBearing();
    const corBrngArray = this.points.map(elem => {
      return Coordinate.bearing(elem, cor);
    })
    const brngDiff = polylineBrngArray.map((elem,index) => {
      return Math.abs(elem-corBrngArray[index]);
    })
    const minIndex = brngDiff.reduce((minIndex, elem, index, array) => {
      return elem < array[minIndex] ? index : minIndex}, 0);
    return minIndex + 1;
  }

  /**
   * auto adjust the coordinate of a point to be addded in the Polyline to
   * guarantee it locates on the Polyline
   * @param {number}      position           the index position of the point to
   *                                         be added
   * @param {Coordinate}  mouseCoordinate    the original Coordinate
   * @return {Coordinate}                    a new Coordinate that locates right
   *                                         on the Polyline
   */
  preciseAddPointPosition = (index, mouseCoordinate) => {
    const distToMouse = Coordinate.surfaceDistance(
      this.points[index - 1],
      mouseCoordinate
    );
    const brngToMouse = Coordinate.bearing(
      this.points[index - 1],
      mouseCoordinate
    );
    const polylineSegmentBrng = Coordinate.bearing(
      this.points[index - 1],
      this.points[index]
    );
    const cosine = Math.cos(
      Cesium.Math.toRadians(brngToMouse - polylineSegmentBrng)
    );
    const trueDist = cosine * distToMouse;
    return Coordinate.destination(
      this.points[index - 1],
      polylineSegmentBrng,
      trueDist
    );
  }

  /**
   * update the point at a specific position to a new point
   * @param {number}  position the index position of the point to be updated
   * @param {Point}   point    the Point object to be added
   */
  updatePoint = (position, point) => {
    if (point instanceof Point) {
      this.points.splice(position, 1, point);
    } else {
      throw new Error('Adding object is not a Point object');
    }
  }

  /**
   * Find the index of the point in the polyline
   * @param  {Point} point the Point object
   * @return {number}      the index of the point, -1 if cannot found
   */
  findPointIndex = (point) => {
    const i = this.points.reduce((p, elem, index, array) => {
      return elem.entityId === p.entityId ? index : p
    }, point);
    if (i === point) {
      return -1;
    }
    return i;
  }

  /**
   * delete a point in a specific position of the polyline
   * @param  {number} position the index position of the point to be deleted
   * @return {Point}           the Point object being deleted
   */
  deletePoint = (position) => {
    if (this.length <= 2) {
      return errorNotification(
        'Invalid Operation',
        'Cannot delete any more point'
      )
    }
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

  /**
   * get the bearings of each segment in the polyline
   * @return {Number[]}   the array of bearings of each segment in the polyline
   */
  getSegmentBearing = () => {
    let brngArray = [];
    for (let i = 0; i < this.length-1; i++) {
      brngArray.push(Point.bearing(this.points[i], this.points[i+1]));
    }
    return brngArray;
  }

  /**
   * get the distance of each segment in the polyline
   * @return {Number[]}   the distance of each segment in the polyline
   */
  getSegmentDistance = () => {
    let distArray = [];
    for (let i = 0; i < this.length-1; i++) {
      distArray.push(Point.surfaceDistance(this.points[i], this.points[i+1]));
    }
    return distArray;
  }

  /**
   * make every segment of the Polyline to be individual Polyline objects
   * @return {Polyline[]} the Polyline objects of every segment of the Polyline
   */
  getSegmentPolyline = () => {
    let polylineArray = [];
    for (let i = 0; i < this.length-1; i++) {
      polylineArray.push(new Polyline([this.points[i], this.points[i+1]]));
    }
    return polylineArray;
  }

  /**
   * get the bearings for aux lines according to the bearing of every segment of
   * the polyline
   * @return {Number[]} a set of bearings
   */
  getHelpLineBearings = () => {
    let brngSet = new Set();
    for (let i = 0; i < this.length-1; i++) {
      const brng = Point.bearing(this.points[i], this.points[i+1]);
      const brng1 = (brng-180)%360 > 0 ? (brng-180)%360 : (brng-180)%360+360;
      const brng2 = (brng+90)%360 > 0 ? (brng+90)%360 : (brng+90)%360+360;
      const brng3 = (brng-90)%360 > 0 ? (brng-90)%360 : (brng-90)%360+360;
      const brng4 = (brng-45)%360 > 0 ? (brng-45)%360 : (brng-45)%360+360;
      const brng5 = (brng+45)%360 > 0 ? (brng+45)%360 : (brng+45)%360+360;
      const brng6 = (brng-135)%360 > 0 ? (brng-135)%360 : (brng-135)%360+360;
      const brng7 = (brng+135)%360 > 0 ? (brng+135)%360 : (brng+135)%360+360;
      brngSet.add(parseFloat(brng.toFixed(5)));
      brngSet.add(parseFloat(brng1.toFixed(5)));
      brngSet.add(parseFloat(brng2.toFixed(5)));
      brngSet.add(parseFloat(brng3.toFixed(5)));
      brngSet.add(parseFloat(brng4.toFixed(5)));
      brngSet.add(parseFloat(brng5.toFixed(5)));
      brngSet.add(parseFloat(brng6.toFixed(5)));
      brngSet.add(parseFloat(brng7.toFixed(5)));
    }
    return brngSet;
  }

  makeGeoJSON = () => {
    const coordinates = this.getPointsCoordinatesArray(false);
    const geoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          coordinates
        ]
      }
    }
    return geoJSON;
  };

  isSelfIntersection = () => {
    const geoJson = this.makeGeoJSON();
    const selfIntersectionDetect = simplepolygon(geoJson);
    return selfIntersectionDetect.features.length >= 2;
  };
}

export default Polyline;
