import * as Cesium from 'cesium';

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
   * @param {number} height the height of the coordinate, fixed to 12 decimal
   *                        places
   */
  constructor (lon, lat, height) {
    this.lon = parseFloat(lon.toFixed(12));
    this.lat = parseFloat(lat.toFixed(12));
    this.height = parseFloat(height.toFixed(1));
  }

  /**
   * get the coordinate
   * @param  {bool} [toArray=null] whether to get the coordinate as an array or
   *                               Object
   * @return {number[]}            A array of three number in the order of
   *                               [lon, lat, height]
   * or
   * @return {Object}              An Object in the form {lon, lat, height}
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
  }

  /**
   * set coordinate by given lon || lat || height
   * @param {number} [lon=null]    the lontitude to set
   * @param {number} [lat=null]    the latitude to set
   * @param {number} [height=null] the height to set
   */
  setCoordinate = (lon=null, lat=null, height=null) => {
    if (lon) this.lon = parseFloat(lon.toFixed(12));
    if (lat) this.lat = parseFloat(lat.toFixed(12));
    if (height) this.height = parseFloat(height.toFixed(1));
  }

  /**
   * convert degree to radian
   * @param  {number} deg degree
   * @return {number}     radian
   */
  static degreesToRadians = (deg) => {
    return deg * (Math.PI/180);
  }

  /**
   * convert radian to degree
   * @param  {number} rad radian
   * @return {number}     degree
   */
  static radiansToDegrees = (rad) => {
    return rad * 180 / Math.PI;
  }

  /**
   * Calculate the surface distance between two coordinate !!IGNORING HEIGHT!!
   * @param  {Coordinate} cor1 first coordinate
   * @param  {Coordinate} cor2 second coordinate
   * @return {Number}          the surface distance between the two coordinates
   */
  static distance = (cor1, cor2) => {
    const R = 6371e3; // metres
    const φ1 = this.degreesToRadians(cor1.lat);
    const φ2 = this.degreesToRadians(cor2.lat);
    const Δφ = this.degreesToRadians(cor2.lat - cor1.lat);
    const Δλ = this.degreesToRadians(cor2.lon - cor1.lon);

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  /**
   * Create a Coordinate object from a Carteisan3 value
   * @param  {Cartesian}  cartesian a Cartesian3 value
   * @return {Coordinate}           a Coordinate object
   */
  static fromCartesian = (cartesian3) => {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
    const lon =
      parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(12));
    const lat =
      parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(12));
    const height = parseFloat(cartographic.height.toFixed(1));
    return new Coordinate(lon, lat, height);
  }
}

export default Coordinate;
