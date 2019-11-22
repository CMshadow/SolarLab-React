import uuid from 'uuid/v1';
import  * as Cesium from 'cesium';

import Coordinate from '../point/coordinate';
import Point from '../point/point';
import FoundLine from '../line/foundLine';

class Polygon {

  /**
   * A Polygon Object
   * @param {string}  [id=null]       unique id of the polygon,
   *                                  automatic generate one if not provided
   * @param {string}  [name=null]     name of the polygon,
   *                                  default name if not provided
   * @param {Number}  [height=0.0]    the height of the polygon,
   *                                  default 0.0 if not provided
   * @param {Number[]}  [hierarchy= [] ] An array of lons lats heights,
   *                                     i.e. [lon, lat, height, lon, lat, height]
   *                                     default empty list
   * @param {Boolean} [perPositionHeight=true]  whether to support points on the
   *                                            polygon having different height,
   *                                            or not (having uniform height),
   *                                            default true
   * @param {Number} [extrudeHeight=0] the height between the bottom of the
   *                                   polygon and the ground
   *                                   default 0 if not provided
   * @param {Color}   [material=null] Cesium Color or GRBA color,
   *                                  Cesium.Color.WHITE if not provided
   * @param {Color}   [outlineColor=null]  Cesium Color or GRBA color,
   *                                       default Cesium.Color.Black if not
   *                                       provided
   * @param {Integer} [outlineWidth=null]  The outline width of Polygon,
   *                                       default 4 if not provided
   * @param {Boolean} [shadow=true]   whether to cast shadow of the polygon on
   *                                  Cesium, default enable
   * @param {Boolean} [show=true]     whether to show the polygon, default true
   */
  constructor(
    id = null,
    name = null,
    height = null,
    hierarchy = null,
    perPositionHeight = null,
    extrudedHeight = null,
    material= null,
    outlineColor = null,
    outlineWidth = null,
    shadow = null,
    show = null,
    brng = null,
    obliquity = null,
    highestNode = null,
    lowestNode = null,
    edgesCollection = null
  ) {
    this.entityId = id ? id : uuid();
    this.name = name ? name: 'Polygon';
    this.height = height ? height : 0.0;
    this.hierarchy = hierarchy ? [...hierarchy] : [];
    this.perPositionHeight = perPositionHeight ? perPositionHeight: true;
    this.extrudedHeight = extrudedHeight ? extrudedHeight: 0.0;
    this.material = material ? material: Cesium.Color.WHITE;
    this.outlineColor = outlineColor ? outlineColor : Cesium.Color.BLACK;
    this.outlineWidth = outlineWidth ? outlineWidth : 4;
    this.shadow = shadow ? Cesium.ShadowMode.ENABLED : Cesium.ShadowMode.DISABLED;
    this.show = show? show: true;
    this.brng = brng ? brng : null;
    this.obliquity = obliquity ? obliquity : 0;
    this.highestNode = highestNode? highestNode : null;
    this.lowestNode = lowestNode? lowestNode : null;
    this.edgesCollection = edgesCollection? [...edgesCollection] : null;
  }

  /**
   *  A copy constructor from an existing Polygon object
    * @param {Polygon}  polygon       the existing Polygon object to be deep copied
    * @param {string}  [id=null]      unique id of the polygon, default using
    *                                 the existing Polygon's id if not provided
    * @param {string}  [name=null]    name of the polygon, default using the
    *                                 existing Polygon's name if not provided
    * @param {Number}  [height=null]  the height of the fouddation, use the
    *                                 existing Polygon's height by default if
    *                                 not provided
    * @param {Number[]}   [hierarchy= [] ]  An array of lons lats heights, i.e.
    *                                       [lon, lat, height, lon, lat, height]
    *                                       use the existing Polygon's hierarchy
    *                                       by default if not provided
    * @param {Boolean} [perPositionHeight=true]  whether to support points on the
    *                                            polygon having different height,
    *                                            or not (having uniform height),
    *                                            use the existing Polygon's
    *                                            setting by default if not provided
    * @param {Number} [extrudeHeight=0] the height between the bottom of the
    *                                   polygon and the ground, use the existing
    *                                   Polygon's setting by default if not provided
    * @param {Color}   [material=null] Cesium Color or GRBA color,
    *                                  use the existing Polygon's
    *                                  setting by default if not provided
    * @param {Color}   [outlineColor=null]  Cesium Color or GRBA color,
    *                                       use the existing Polygon's
    *                                       setting by default if not provided
    * @param {Integer} [outlineWidth=null]  The outline width of Polygon,
    *                                       use the existing Polygon's
    *                                       setting by default if not provided
    * @param {Boolean} [shadow=true]   whether to cast shadow of the polygon on
    *                                  Cesium, use the existing Polygon's
    *                                  setting by default if not provided
    * @param {Boolean} [show=true]     whether to show the polygon, use the
    *                                  existing Polygon's setting by default if
    *                                  not provided
  */
  static copyPolygon (
    polygon,
    id = null,
    name = null,
    height= null,
    hierarchy = null,
    perPositionHeight = true,
    extrudedHeight = null,
    material=null,
    outlineColor= null,
    outlineWidth= null,
    shadow=null,
    show=null,
    brng = null,
    obliquity = null,
    highestNode = null,
    lowestNode = null,
    edgesCollection = null
  ){
    const newID = id ? id : polygon.id;
    const newName = name ? name : polygon.name;
    const newHeight = height ? height: polygon.height;
    const newHierarchy = hierarchy ? [...hierarchy]: polygon.hierarchy;
    const newPerPositionHeight =
      perPositionHeight ?
      perPositionHeight:
      polygon.perPositionHeight;
    const newExtrudedHeight =
      extrudedHeight ?
      extrudedHeight:
      polygon.extrudedHeight;
    const newMaterial = material ? material: polygon.material;
    const newOutLineColor = outlineColor ? outlineColor : polygon.outlineColor;
    const newOutLineWidth = outlineWidth ? outlineWidth : polygon.outlineWidth;
    const newShadow = shadow? shadow: true;
    const newShow = show? show: true;
    const newBrng = brng? brng: polygon.brng;
    const newObliquily = obliquity? obliquity: polygon.obliquity;
    const newHighestNode = highestNode? highestNode: polygon.highestNode;
    const newLowestNode = lowestNode? lowestNode: polygon.lowestNode;
    const newEdgesCollection = edgesCollection? [...edgesCollection]: polygon.edgesCollection;
    return new Polygon(
      newID, newName, newHeight, newHierarchy, newPerPositionHeight,
      newExtrudedHeight, newMaterial, newOutLineColor, newOutLineWidth,
      newShadow, newShow, newBrng, newObliquily, newHighestNode, newLowestNode, newEdgesCollection
    );
  };

  /**
   * create the hierarchy for a Polygon object by a given Polyline object
   * @param  {Polyline} polyline             the given Polyline object
   * @param  {NUmber} [overwriteHeight=null] overwriteheight to overwirte the
   *                                         height of the points on the polyline
   * @param  {Number} [heightOffset=0] heightoffset addition to overwriteHeight
   * @return {Number[]}                      the array can be used as the hierarchy
   *                                         of a Polygon object.
   *                                         i.e. [lon, lat, height, lon, lat, height ...]
   */
  static makeHierarchyFromPolyline = (
    polyline, overwriteHeight = null, heightOffset = 0
  ) => {
    let polylineHierarchy = null;

    if (polyline instanceof FoundLine) {
      polylineHierarchy = polyline.points.slice(0, -1).flatMap(p =>
        p.getCoordinate(true)
      );
    } else {
      polylineHierarchy = polyline.getPointsCoordinatesArray();
    }
    if (overwriteHeight) {
      for (let i = 0; i < polylineHierarchy.length; i+=3){
        polylineHierarchy[i+2] = overwriteHeight + heightOffset;
      }
    }
    return polylineHierarchy;
  }

  static makeHierarchyFromGeoJSON = (GeoJSON, height, heightOffset = 0) => {
    let polylineHierarchy = [];
    GeoJSON.geometry.coordinates[0].forEach(cor => {
      polylineHierarchy = polylineHierarchy.concat(
        [cor[0], cor[1], height + heightOffset]
      );
    });
    return polylineHierarchy;
  }

  /**
   * get the coordinates array of the  polygon
   * @return {Number[]} An array of lon, lat, heights that represents the polygon,
   *                    i.e. [lon1, lat1, height1, lon2, lat2, height2 ...]
   *                    must be at least 3 mor multiples of 3
   */
  getFoundationCoordinatesArray = () => (this.hierarchy);

  /**
   * set the height of polygon foundatoin
   * @param {Number} newHeight the height of the foundation polygon
   */
  setHeight = (newHeight) => {
    this.height = newHeight;
  };

  /**
   * set the hierarychy of polygon foundatoin
   * @param {Number[]} newHierarchy the new hierarchy of the foundation polygon
   */
  setHierarchy = (newHierarchy) => {
    this.hierarchy = newHierarchy;
  };

  /**
   * change the color of the polygon
   * @param {Color} newColor new Cesium.Color or RGBA color
   */
  setColor = (newColor) => {
    this.material = newColor;
  };

  toFoundLine = () => {
    const firstAndLastPoint = new Point(
      this.hierarchy[0], this.hierarchy[1], this.hierarchy[2]
    );
    let points = [firstAndLastPoint];
    for (let i = 3; i < this.hierarchy.length; i+=3) {
      points.push(
        new Point(this.hierarchy[i], this.hierarchy[i+1], this.hierarchy[i+2])
      );
    }
    points.push(firstAndLastPoint);
    return new FoundLine(points);
  }

}
export default Polygon;
