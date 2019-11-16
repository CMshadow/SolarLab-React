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
  constructor (lon = null, lat = null, zoom = null, optimalAzimuth = null,
    optimalTilt = null
  ) {
    this.projectLon = lon;
    this.projectLat = lat;
    this.projectZoom = zoom;
    this.buildingCollection = new BuildingCollection();
    this.weatherFileExist = false;
    this.weatherFileLocation = null;
    this.globalOptimalAzimuth = optimalAzimuth;
    this.globalOptimalTilt = optimalTilt;
  }

  setGlobalOptimal(azimuth, tilt) {
    this.globalOptimalAzimuth = azimuth;
    this.globalOptimalTilt = tilt;
  }
}

export default ProjectInfo;
