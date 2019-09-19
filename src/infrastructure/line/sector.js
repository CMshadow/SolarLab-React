import * as Cesium from 'cesium';

import Polyline from './polyline';
import Point from '../point/point';

class Sector extends Polyline {

  constructor (points, originCor, brng, radius, angle, id = null, name = null,
    color = null, width = null, show = true
  ) {
    super(points, id, name, color, width, show);
    this.originCor = originCor;
    this.brng = brng;
    this.radius = radius;
    this.angle = angle;
  }

  static calculatePoints = (originCor, brng, radius, angle, color) => {
    const points = [];
    for (
      let direction = brng - angle/2; direction <= brng + angle/2; direction+=5
    ) {
      points.push(
        Point.fromCoordinate(
          Point.destination(originCor, direction, radius),
          null, null, null, color
        )
      );
    }
    return points;
  }

  static fromProps = (originCor, brng, radius, angle, id = null, name = null,
    color = null, width = null, show = true
  ) => {
    const points = [
      Point.fromCoordinate(originCor, null, null, null, Cesium.Color.CADETBLUE)
    ]
    const insertPoints = this.calculatePoints(
      originCor, brng, radius, angle, color
    );
    insertPoints.forEach(p => points.push(p));
    return new Sector(
      [...points, points[0]], originCor, brng, radius,
      angle, id, name, color, width, show
    );
  }

  static fromPolyline = (
    sector, id = sector.entityId, name = null, color = null, width = null,
    show = true
  ) => {
    const priorPoints = sector.points.slice(0, sector.length-1).map(elem => {
      return Point.fromPoint(elem);
    });
    const originCor = sector.originCor;
    const brng = sector.brng;
    const radius = sector.radius;
    const angle = sector.angle;
    const newPoints = [...priorPoints, priorPoints[0]];
    const newName = name ? name : sector.name;
    const newColor = color ? color : sector.color;
    const newShow = show ? show : sector.show;
    const newWidth = width ? width : sector.width;
    return new Sector (
      newPoints, originCor, brng, radius, angle, id, newName,
      newColor, newWidth, newShow
    );
  }

  updateOriginCor = (newOriginCor) => {
    const newPoints = Sector.calculatePoints(
      newOriginCor, this.brng, this.radius, this.angle, this.color
    );
    const newOriginPoint = Point.fromPoint(this.points[0]);
    newOriginPoint.setCoordinate(
      newOriginCor.lon, newOriginCor.lat, newOriginCor.height
    );
    newPoints.splice(0, 0, newOriginPoint);
    newPoints.splice(newPoints.length, 0, newOriginPoint);
    this.points = newPoints;
    this.originCor = newOriginCor;
  }

  updateRadius = (newRadius) => {
    const newPoints = Sector.calculatePoints(
      this.originCor, this.brng, newRadius, this.angle, this.color
    );
    const newOriginPoint = Point.fromPoint(this.points[0]);
    newPoints.splice(0, 0, newOriginPoint);
    newPoints.splice(newPoints.length, 0, newOriginPoint);
    this.points = newPoints;
    this.radius = newRadius;
  }

  updateAngle = (mouseBearing) => {
    const brngChange =
      (this.brng-mouseBearing > 0 ?
      this.brng-mouseBearing :
      360+(this.brng-mouseBearing))-this.angle/2
    const newAngle = this.angle + brngChange;
    const newPoints = Sector.calculatePoints(
      this.originCor, (mouseBearing+newAngle/2)%360, this.radius, newAngle, this.color
    );
    const newOriginPoint = Point.fromPoint(this.points[0]);
    newPoints.splice(0, 0, newOriginPoint);
    newPoints.splice(newPoints.length, 0, newOriginPoint);
    this.points = newPoints;
    this.brng = (mouseBearing+newAngle/2)%360;
    this.angle = newAngle;
  }

  updateBearing = (mouseBearing) => {
    const newBearing = (
      mouseBearing - this.angle/2 > 0 ?
      mouseBearing - this.angle/2 :
      360 + (mouseBearing - this.angle/2)
    )%360;
    const newPoints = Sector.calculatePoints(
      this.originCor, newBearing, this.radius, this.angle, this.color
    );
    const newOriginPoint = Point.fromPoint(this.points[0]);
    newPoints.splice(0, 0, newOriginPoint);
    newPoints.splice(newPoints.length, 0, newOriginPoint);
    this.points = newPoints;
    this.brng = newBearing;
  }
}

export default Sector;
