import Polyline from './polyline';
import Point from '../point/point';

class Circle extends Polyline {

  constructor (points, originCor, radius, id = null, name = null,
    color = null, width = null, show = true
  ) {
    super(points, id, name, color, width, show);
    this.centerPoint = Point.fromCoordinate(
      originCor,
      null,
      originCor.entityId ? originCor.entityId : null,
      null,
      originCor.color ? originCor.color : color
    );
    this.radius = radius;
  }

  static calculatePoints = (originCor, radius, color) => {
    const points = [];
    for (let direction = 0; direction <= 355; direction+=5) {
      points.push(
        Point.fromCoordinate(
          Point.destination(originCor, direction, radius),
          null, null, null, color
        )
      );
    }
    return points;
  }

  static fromProps = (originCor, radius, id = null, name = null,
    color = null, width = null, show = true
  ) => {
    const points = []
    const insertPoints = this.calculatePoints(originCor, radius, color);
    insertPoints.forEach(p => points.push(p));
    return new Circle(
      [...points, points[0]], originCor, radius, id, name, color, width, show
    );
  }

  static fromPolyline = (
    circle, id = circle.entityId, name = null, color = null, width = null,
    show = true
  ) => {
    const priorPoints = circle.points.slice(0, circle.length-1).map(elem => {
      return Point.fromPoint(elem);
    });
    const centerPoint = circle.centerPoint;
    const radius = circle.radius;
    const newPoints = [...priorPoints, priorPoints[0]];
    const newName = name ? name : circle.name;
    const newColor = color ? color : circle.color;
    const newShow = show ? show : circle.show;
    const newWidth = width ? width : circle.width;
    return new Circle (
      newPoints, centerPoint, radius, id, newName, newColor, newWidth, newShow
    );
  }

  updateCenterPoint = (newOriginCor) => {
    const newPoints = Circle.calculatePoints(
      newOriginCor, this.radius, this.color
    );
    const newCenterPoint = Point.fromPoint(this.centerPoint);
    newCenterPoint.setCoordinate(
      newOriginCor.lon, newOriginCor.lat, newOriginCor.height
    );
    this.points = [...newPoints, newPoints[0]];
    this.centerPoint = newCenterPoint;
  }

  updateRadius = (newRadius) => {
    const newPoints = Circle.calculatePoints(
      this.centerPoint, newRadius, this.color
    );
    this.points = [...newPoints, newPoints[0]];
    this.radius = newRadius;
  }
}

export default Circle;
