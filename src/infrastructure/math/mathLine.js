import Coordinate from '../point/coordinate';

class MathLine {
  constructor (originCor = null, brng = null, dist = null, dest = null) {
    this.originCor = originCor || null;
    this.brng = brng !== null ? brng : null;
    this.dist = dist || null;
    this.dest = dest || null;
  }

  static fromPolyline(polyline) {
    const originCor = polyline.points[0];
    const dest = polyline.points[1];
    const brng = Coordinate.bearing(originCor, dest);
    const dist = Coordinate.surfaceDistance(originCor, dest);
    return new MathLine(originCor, brng, dist, dest);
  }
}

export default MathLine;
