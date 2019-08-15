import { Color } from 'cesium';
import uuid from 'uuid/v1';

import Point from '../point/point';

class Polyline {

  constructor (points=null, id=null, name=null, color=null, width=null, show=true) {
    this.points = points ? points : [];
    this.entityId = id ? id : uuid();
    this.name = name ? name : 'vertex';
    this.color = color ? color : Color.WHITE;
    this.show = show;
    this.width = width ? width : 4;
  }

  addPoint = (position, point) => {
    this.points.splice(position, 0, point);
  }

  deletePoint = (position) => {
    this.points.splice(position, 1);
  }

  getPointsCoordinatesArray = (flat=true) => {
    let flatArray = [];
    this.points.map(point => {
      return flatArray = flatArray.concat(point.getCoordinate(true));
    });
    return flatArray;
  }
}

export default Polyline;
