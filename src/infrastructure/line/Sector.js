import * as Cesium from 'cesium';

import Polyline from './polyline';
import Point from '../point/point';

class Sector extends Polyline {
  constructor (originCor, brng, radius, angle, id = null, name = null, color = null,
    width = null, show = true
  ) {
    super([Point.fromCoordinate(originCor)], id, name, color, width, show);
    const points = this.calculatePoints(originCor, brng, radius, angle);
    for (const p of points) {
      this.addPointTail(p);
    }
  }

  calculatePoints = (originCor, brng, radius, angle) => {
    const points = [];
    for (
      let direction = brng - angle/2; direction < brng + angle/2; direction+=5
    ) {
      points.push(Point.destination(originCor, direction, radius));
    }
    return points;
  }
}

export default Sector;
