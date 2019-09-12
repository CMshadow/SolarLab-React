import * as Cesium from 'cesium';
import uuid from 'uuid/v1';
import errorNotification from '../../components/ui/Notification/ErrorNotification';

import Point from '../point/point';
import Polyline from './polyline';
import Coordinate from '../point/coordinate';

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

}

export default FoundLine;
