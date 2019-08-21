import BuildingCollection from '../buildingCollection/buildingCollection';

/**
 * A Object managing project-level information,
 * including:
 *  geographic info, weather file location, global optimal values, ...
 */
class ProjectInfo {

  /**
   * ProjectInfo constructor
   * @param {Number} [lon=null]  the lontitude of the project location
   * @param {Number} [lat=null]  the latitude of the project location
   * @param {Number} [zoom=null] the zoom of the project location, used for
   *                             Camera Flyto
   */
  constructor (lon = null, lat = null, zoom = null) {
    this.projectLon = lon;
    this.projectLat = lat;
    this.projectZoom = zoom;
    this.buildingCollection = new BuildingCollection();
    this.weatherFileExist = false;
    this.weatherFileLocation = null;
    this.globalOptimalAzimuth = null;
    this.globalOptimalTilt = null;
  }
}

export default ProjectInfo;
