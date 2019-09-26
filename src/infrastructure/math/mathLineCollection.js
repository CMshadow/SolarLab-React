import MathLine from './mathLine';
import Point from '../point/point';

class MathLineCollection {
  constructor(mathLines=null) {
    this.mathLineCollection = mathLines ? mathLines : [];
  }

  length () {
    return this.mathLineCollection.length;
  }

  addMathLine = (mathLine) => {
    this.mathLineCollection.push(mathLine);
  }

  static fromPolyline = (polyline) => {
    const mathLines = [];
    const segmentPolyline = polyline.getSegmentPolyline();
    const segmentBrng = polyline.getSegmentBearing();
    const segmentDistance = polyline.getSegmentDistance();
    segmentPolyline.forEach((segment, index) => {
      mathLines.push(
        new MathLine(
          segment.points[0], segmentBrng[index], segmentDistance[index]
        )
      );
    })
    return new MathLineCollection(mathLines);
  }

  toPolylinePoints () {
    const points = [];
    for (let elem of this.mathLineCollection) {
      points.push(Point.fromCoordinate(elem.originCor));
    }
    return [...points, points[0]];
  }
}

export default MathLineCollection;
