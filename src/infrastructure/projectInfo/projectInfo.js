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

  static fromProjectInfo(projectInfo) {
    const newLon = projectInfo.projectLon;
    const newLat = projectInfo.projectLat;
    const newZoom = projectInfo.projectZoom;
    const newBuildingCollect = projectInfo.buildingCollection;
    const newWeatherFileExist = projectInfo.weatherFileExist;
    const newWeatherFileLocation = projectInfo.weatherFileLocation;
    const newGlobalAzimuth = projectInfo.globalOptimalAzimuth;
    const newGlobalTilt = projectInfo.globalOptimalTilt;
    return new ProjectInfo(
      newLon, newLat, newZoom, newBuildingCollect, newWeatherFileExist,
      newWeatherFileLocation, newGlobalAzimuth, newGlobalTilt
    );
  }
}

export default ProjectInfo;
