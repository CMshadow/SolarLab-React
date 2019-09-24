import * as Cesium from 'cesium';
import simplepolygon from 'simplepolygon';

import errorNotification from '../../components/ui/Notification/ErrorNotification';
import Point from '../point/point';
import Polyline from './polyline';
import Coordinate from '../point/coordinate';
import MathLineCollection from '../math/mathLineCollection';
import MathLine from '../math/mathLine';

class FoundLine extends Polyline {

  /**
   * A polyline
   * @param {Point}   [points=null]   A list of Point objects, default empty
   * @param {string}  [id=null]       unique id of the polyline, automatic
   *                                  generate one if not provided
   * @param {string}  [name=null]     name of the polyline, automatic generate
   *                                  one if not provided
   * @param {Color}   [color=null]    GRBA color, Cesium.Color.WHITE if not
   *                                  provided
   * @param {int}     [width=null]    width of the polyline, default 4
   * @param {Boolean} [show=true]     whether to show the polyline,
   *                                  default true
   */
  constructor (
    points = null, id = null, name = null, color = null, width = null,
    show = true
  ) {
    super(points, id, name, color, width, show)
  }

  /**
   * A copy constructor from an existing Polyline object
   * @param  {Polyline} polyline      the existing Polyline object to be
   *                                  copied
   * @param  {string}   [id=null]     unique id of the polyline, automatic
   *                                  generate one if not provided
   * @param  {string}   [name=null]   name of the polyline, copy the existing
   *                                  one if not provided
   * @param  {.Color}   [color=null]  GRBA color, copy the existing one if
   *                                  not provided
   * @param  {int}      [width=null]  width of the polyline, copy the
   *                                  existing one if not provided
   * @param  {Boolean}  [show=true]   whether to show the polyline, copy the
   *                                  existing one if not provided
   * @return {Polyline}               new Polyline object
   */
  static fromPolyline (
    polyline, id = polyline.entityId, name = null, color = null, width = null,
    show = true
  ) {
    const priorPoints = polyline.points.slice(0, polyline.length-1)
    .map(elem => {
      return Point.fromPoint(elem);
    });
    const newPoints = [...priorPoints, priorPoints[0]];
    const newName = name ? name : polyline.name;
    const newColor = color ? color : polyline.color;
    const newShow = show ? show : polyline.show;
    const newWidth = width ? width : polyline.width;
    return new FoundLine (newPoints, id, newName, newColor, newWidth, newShow);
  }

  /**
   * delete a point in a specific position of the polyline
   * @param  {number} position the index position of the point to be deleted
   * @return {Point}           the Point object being deleted
   */
  deletePoint = (position) => {
    if (this.length <= 4) {
      return errorNotification(
        'Invalid Operation',
        'Cannot delete any more point'
      )
    }
    if (position < this.length) {
      const deletedPoint = this.points.splice(position, 1);
      if (position === 0) {
        this.points.splice(this.length-1, 1);
        this.addPoint(this.length, this.points[0]);
      }
      return deletedPoint[0];
    } else {
      throw new Error('The index is beyond Polyline length');
    }
  }

  getHelpLineBearings = () => {
    let brngSet = new Set();
    for (let i = 0; i < this.length-2; i++) {
      const brng = Point.bearing(this.points[i], this.points[i+1]);
      const brng1 = (brng-180)%360 > 0 ? (brng-180)%360 : (brng-180)%360+360;
      const brng2 = (brng+90)%360 > 0 ? (brng+90)%360 : (brng+90)%360+360;
      const brng3 = (brng-90)%360 > 0 ? (brng-90)%360 : (brng-90)%360+360;
      const brng4 = (brng-45)%360 > 0 ? (brng-45)%360 : (brng-45)%360+360;
      const brng5 = (brng+45)%360 > 0 ? (brng+45)%360 : (brng+45)%360+360;
      const brng6 = (brng-135)%360 > 0 ? (brng-135)%360 : (brng-135)%360+360;
      const brng7 = (brng+135)%360 > 0 ? (brng+135)%360 : (brng+135)%360+360;
      brngSet.add(parseFloat(brng.toFixed(5)));
      brngSet.add(parseFloat(brng1.toFixed(5)));
      brngSet.add(parseFloat(brng2.toFixed(5)));
      brngSet.add(parseFloat(brng3.toFixed(5)));
      brngSet.add(parseFloat(brng4.toFixed(5)));
      brngSet.add(parseFloat(brng5.toFixed(5)));
      brngSet.add(parseFloat(brng6.toFixed(5)));
      brngSet.add(parseFloat(brng7.toFixed(5)));
    }
    return brngSet;
  }

  makeSetbackPolylineOutside = (stbDist) => {
    const originPolyline = this.makeSetbackPolyline(stbDist, 'outside');
    if (originPolyline.polyline.isSelfIntersection()) {
      return originPolyline.polyline.removeOutsideSetbackSelfIntersection(
        originPolyline.direction
      );
    } else {
      return [originPolyline.polyline]
    }
  }

  makeSetbackPolylineInside = (stbDist) => {
    const originPolyline = this.makeSetbackPolyline(stbDist, 'inside');
    if (originPolyline.polyline.isSelfIntersection()) {
      return originPolyline.polyline.splitInsideSetbackSelfIntersection(
        originPolyline.direction
      );
    } else {
      return [originPolyline.polyline]
    }
  }

  makeSetbackPolyline = (stbDist, type) => {
    const mathLineCollection = MathLineCollection.fromPolyline(this);

    const result = [];
    for(let direction of [90, -90]) {
      const stbMathLineCollection = new MathLineCollection();
      mathLineCollection.mathLineCollection.forEach(mathLine => {
        const anchor = Coordinate.destination(
          mathLine.originCor, mathLine.brng + direction, stbDist
        );
        stbMathLineCollection.addMathLine(new MathLine(anchor, mathLine.brng));
      });
      stbMathLineCollection.mathLineCollection.forEach((mathLine, index) => {
        let nextMathLine = null;
        if (index < stbMathLineCollection.length - 1) {
          nextMathLine = stbMathLineCollection.mathLineCollection[index + 1];
        } else {
          nextMathLine = stbMathLineCollection.mathLineCollection[0];
        }
        const intersectCandidate1 = Coordinate.intersection(
          mathLine.originCor,
          mathLine.brng,
          nextMathLine.originCor,
          nextMathLine.brng-180
        );
        const intersectCandidate2 = Coordinate.intersection(
          mathLine.originCor,
          mathLine.brng,
          nextMathLine.originCor,
          nextMathLine.brng
        );
        const intersectCandidate3 = Coordinate.intersection(
          mathLine.originCor,
          mathLine.brng-180,
          nextMathLine.originCor,
          nextMathLine.brng-180
        );
        const intersectCandidate4 = Coordinate.intersection(
          mathLine.originCor,
          mathLine.brng-180,
          nextMathLine.originCor,
          nextMathLine.brng
        );
        const intersectCandidateCompare = [
          {
            'candidate':intersectCandidate1,
            'dist':
              Coordinate.surfaceDistance(mathLine.originCor, intersectCandidate1)
          },
          {
            'candidate':intersectCandidate2,
            'dist':
              Coordinate.surfaceDistance(mathLine.originCor, intersectCandidate2)
          },
          {
            'candidate':intersectCandidate3,
            'dist':
              Coordinate.surfaceDistance(mathLine.originCor, intersectCandidate3)
          },
          {
            'candidate':intersectCandidate4,
            'dist':
              Coordinate.surfaceDistance(mathLine.originCor, intersectCandidate4)
          }
        ];
        intersectCandidateCompare.sort((a,b) => (a.dist < b.dist) ? -1 : 1);
        const intersection = intersectCandidateCompare[0].candidate;

        mathLine.dist = Coordinate.surfaceDistance(
          mathLine.originCor, intersection
        );
        nextMathLine.originCor = intersection
      });
      const stbPolyline = stbMathLineCollection.toPolyline();
      result.push({
        'polyline': stbPolyline,
        'direction': direction,
        'polylineArea': stbPolyline.polylineArea
      })
    }
    if (type === 'inside') {
      return result.reduce((acc,val) => (
        acc.polylineArea > val.polylineArea ? val : acc
      ), result[0])
    } else {
      return result.reduce((acc,val) => (
        acc.polylineArea < val.polylineArea ? val : acc
      ), result[0])
    }
  }

  removeOutsideSetbackSelfIntersection = (direction) => {
    const splitGeoJSON = simplepolygon(this.makeGeoJSON());
    const splitPolylines = [];
    splitGeoJSON.features.forEach(elem => {
      if (elem.properties.parent < 0) {
        const points = elem.geometry.coordinates[0].slice(0,-1).map(cor =>
          new Point(cor[0], cor[1], cor[2] ? cor[2] : this.points[0].height)
        );
        splitPolylines.push(new FoundLine([...points, points[0]]));
      }
    });
    return splitPolylines;
  };

  splitInsideSetbackSelfIntersection = (direction) => {
    const splitGeoJSON = simplepolygon(this.makeGeoJSON());
    const splitPolylines = [];
    const windingDirection = splitGeoJSON.features[0].properties.winding;
    splitGeoJSON.features.forEach(elem => {
      if (
        elem.properties.winding === windingDirection &&
        elem.properties.parent < 1
      ) {
        const points = elem.geometry.coordinates[0].slice(0,-1).map(cor =>
          new Point(cor[0], cor[1], cor[2] ? cor[2] : this.points[0].height)
        );
        splitPolylines.push(new FoundLine([...points, points[0]]));
      }
    });
    return splitPolylines;
  };
}

export default FoundLine;
