import * as Cesium from 'cesium';

import {
  coordinateToVector,
  vectorToCoordinate,
  greatCircle,
  cross,
  dot,
  plus
} from '../math/math';

/**
 * A coordinate class
 */
class Coordinate {

  /**
   * Create a coordinate
   * @param {number} lon    the lontitude of the coordinate, fixed to 12 decimal
   *                        places
   * @param {number} lat    the latitude of the coordinate, fixed to 12 decimal
   *                        places
   * @param {number} height the height of the coordinate, fixed to 1 decimal
   *                        places
   */
  constructor (lon, lat, height) {
    this.lon = parseFloat(lon.toFixed(12));
    this.lat = parseFloat(lat.toFixed(12));
    this.height = parseFloat(height.toFixed(3));
  };

  /**
   * Create a Coordinate object from a Carteisan3 value
   * @param  {Cartesian}  cartesian3            a Cartesian3 value
   * @param  {number}     [absoluteHeight=null] a given height to overwrite the
   *                                            cartesian3 height
   * @return {Coordinate}                       a Coordinate object
   */
  static fromCartesian = (cartesian3, absoluteHeight=null) => {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
    const lon =
      parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(12));
    const lat =
      parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(12));
    let height = null;
    if (absoluteHeight) {
      if (typeof(absoluteHeight) !== 'number') {
        throw new Error('Given height is not a number');
      }
      height = absoluteHeight;
    } else {
      height = parseFloat(cartographic.height.toFixed(3));
    }
    return new Coordinate(lon, lat, height);
  };

  /**
   * Convert a Coordinate to Cartesian3
   * @param  {Coordinate} coordinate the Coordinate object to be converted
   * @return {Cartesian3}            the Cartesian3 coordinate corresponding to
   *                                 the given Coordinate object
   */
  static toCartesian = (coordinate) => {
    return Cesium.Cartesian3.fromDegrees(
      coordinate.lon, coordinate.lat, coordinate.height
    );
  }

  /**
   * get the coordinate
   * @param  {Boolean} [toArray=false] whether to get the coordinate as an array
   *                                   or Object
   * @return {number[]}                A array of three number in the order of
   *                                   [lon, lat, height]
   * or
   * @return {Object}                  An Object in the form {lon, lat, height}
   */
  getCoordinate = (toArray=false) => {
    if (toArray) {
      return [this.lon, this.lat, this.height];
    } else {
      return {
        lon: this.lon,
        lat: this.lat,
        height: this.height
      };
    }
  };

  /**
   * set coordinate by given lon || lat || height
   * @param {number} [lon=null]    the lontitude to set
   * @param {number} [lat=null]    the latitude to set
   * @param {number} [height=null] the height to set
   */
  setCoordinate = (lon=null, lat=null, height=null) => {
    if (lon) this.lon = parseFloat(lon.toFixed(12));
    if (lat) this.lat = parseFloat(lat.toFixed(12));
    if (height) this.height = parseFloat(height.toFixed(3));
  }

  /**
   * set coordinate by given cartesian3 coordinate value
   * @param {Cartesian} [cartesian3=null]   a Cartesian3 value of the new
   *                                        coordinate
   * @param {number}  [absoluteHeight=null] a given height to overwrite the
   *                                        cartesian3 height
   */
  setCartesian3Coordinate = (cartesian3=null, absoluteHeight=null) => {
    if (cartesian3) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
      const lon =
        parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(12));
      const lat =
        parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(12));
      let height = null;
      if (absoluteHeight) {
        height = absoluteHeight;
      } else {
        height = parseFloat(cartographic.height.toFixed(3));
      }
      this.setCoordinate(lon, lat, height);
    }
  }

  /**
   * Calculate the surface distance between two coordinate !!IGNORING HEIGHT!!
   * @param  {Coordinate} cor1 first coordinate
   * @param  {Coordinate} cor2 second coordinate
   * @return {Number}          the surface distance between the two coordinates
   */
  static surfaceDistance = (cor1, cor2) => {
    const R = 6371e3; // metres
    const φ1 = Cesium.Math.toRadians(cor1.lat);
    const φ2 = Cesium.Math.toRadians(cor2.lat);
    const Δφ = Cesium.Math.toRadians(cor2.lat - cor1.lat);
    const Δλ = Cesium.Math.toRadians(cor2.lon - cor1.lon);

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  /**
   * Calculate the linear distance between two coordinate
   * @param  {Coordinate} cor1 first coordinate
   * @param  {Coordinate} cor2 second coordinate
   * @return {Number}          the linear distance between the two coordinates
   */
  static linearDistance = (cor1, cor2) => {
    return Cesium.Cartesian3.distance(
      Cesium.Cartesian3.fromDegreesArrayHeights(cor1.getCoordinate(true)),
      Cesium.Cartesian3.fromDegreesArrayHeights(cor2.getCoordinate(true))
    );
  }

  /**
   * Calculate the bearing in degrees from cor1 to cor2, the bearing towards
   * north is 0 degree; towards east is 90 degree; towards south is 180 degree;
   * towards west is 270 degree.
   * @param  {Coordinate} cor1 first coordinate
   * @param  {Coordinate} cor2 second coordinate
   * @return {Number}          the bearing in degrees from cor1 to cor2
   */
  static bearing = (cor1, cor2) => {
    const cor1Lon = Cesium.Math.toRadians(cor1.lon);
    const cor1Lat = Cesium.Math.toRadians(cor1.lat);
    const cor2Lon = Cesium.Math.toRadians(cor2.lon);
    const cor2Lat = Cesium.Math.toRadians(cor2.lat);

    const y = Math.sin(cor2Lon-cor1Lon) * Math.cos(cor2Lat);
    const x = Math.cos(cor1Lat) * Math.sin(cor2Lat) -
              Math.sin(cor1Lat) * Math.cos(cor2Lat) * Math.cos(cor2Lon-cor1Lon);
    const brng = Cesium.Math.toDegrees(Math.atan2(y, x));
    return (brng+360)%360;
  };

  /**
   * calculate the destination Coordinate from a Coordinate in a specific
   * bearing and distance
   * @param  {Coordinate} cor  origin Coordinate
   * @param  {number}     brng travel bearing
   * @param  {number}     dist travel distance
   * @return {Coordinate}      destination Coordinate
   */
  static destination = (cor, brng, dist) => {
    const earth_radius = 6371;
    const angularDist = dist/1000/earth_radius;
    const cor1Lon = Cesium.Math.toRadians(cor.lon);
    const cor1Lat = Cesium.Math.toRadians(cor.lat);
    const angularBrng = Cesium.Math.toRadians(brng);

    const destLat = Math.asin(
      Math.sin(cor1Lat) * Math.cos(angularDist) + Math.cos(cor1Lat)
      * Math.sin(angularDist) * Math.cos(angularBrng)
    );
    const destLon = cor1Lon + Math.atan2(
      Math.sin(angularBrng) * Math.sin(angularDist) * Math.cos(cor1Lat),
      Math.cos(angularDist) - Math.sin(cor1Lat) * Math.sin(destLat)
    );

    return new Coordinate(
      Cesium.Math.toDegrees(destLon),
      Cesium.Math.toDegrees(destLat),
      cor.height
    )
  };

  /**
   * the possible intersection Coordinate of two Coordinates traveling towards
   * two different bearings
   * @param  {Coordinate} cor1  first Coordinate object
   * @param  {Number}     brng1 the traveling bearing of the first Coordinate obj
   * @param  {Coordinate} cor2  second Coordinate object
   * @param  {Number}     brng2 the traveling bearing of the second Coordinate obj
   * @return {Coordinate}       the possible intersection Coordinate object, if
   *                            the intersection exists
   * or
   * @return {undefined}       undefined if the intersection does not exist
   */
  static intersection = (cor1, brng1, cor2, brng2) => {
    const avgHeight = (cor1.height + cor2.height) / 2;

    const p1 = coordinateToVector(cor1);
    const p2 = coordinateToVector(cor2);

    const c1 = greatCircle(cor1, brng1);
    const c2 = greatCircle(cor2, brng2);

    let i1 = cross(c1,c2);
    let i2 = cross(c2,c1);

    let intersection=null;
    const dir1 = Math.sign(dot(cross(c1,p1), i1));
    const dir2 = Math.sign(dot(cross(c2,p2), i1));

    switch (dir1+dir2) {
      case  2:
        intersection = i1;
        break;
      case -2:
        intersection = i2;
        break;
      case  0:
        intersection = dot(plus(p1,p2), i1) > 0 ? i2 : i1;
        break;
      default:
        break;
    }

    if (intersection){
      return vectorToCoordinate(intersection, avgHeight);
    }
    return undefined;
  }

  /**
   * the possible intersection Coordinate of two Coordinates traveling towards
   * @param  {Polygon}     path the polygon that represents an rooftop
   * @param  {Coordinate} point  the coordiatne of an arbitrary point created by mouse click
   * @return {Number}       the height from this point to the builidng foundation plane
   */
  static heightOfArbitraryNode = (path, point) => {
    let heightOfPoint = null;
    let outerEdge = null;
    for (let edge = 0; edge < path.edgesType.length; ++edge) {
      if (path.edgesType[edge] === "OuterEdge") {
        outerEdge = edge;
      }
    }
    if (outerEdge !== null) {
      let startNode = new Coordinate(path.hierarchy[outerEdge * 3] , path.hierarchy[outerEdge * 3 + 1], path.hierarchy[outerEdge * 3 + 2]);
      let endNode = null;
      if (outerEdge === path.edgesType.length - 1) {
        endNode = new Coordinate(path.hierarchy[0], path.hierarchy[1], path.hierarchy[2]);
      } else {
        endNode = new Coordinate(path.hierarchy[(outerEdge + 1) * 3], path.hierarchy[(outerEdge + 1) * 3 + 1], path.hierarchy[(outerEdge + 1) * 3 + 2]);
      }
      let edgeBrng = Coordinate.bearing(startNode, endNode);
      let interPoint = Coordinate.intersection(point, path.brng, startNode, edgeBrng);
      let shortestDist = Coordinate.surfaceDistance(point, interPoint);
      heightOfPoint = Math.tan(path.obliquity * Math.PI/180) * shortestDist; 
    }
    return heightOfPoint;
  }
}

export default Coordinate;
