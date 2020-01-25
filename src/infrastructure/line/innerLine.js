import { Color } from 'cesium';
import Point from '../point/point';
import Polyline from './polyline';

class InnerLine extends Polyline {

  /**
   * A InnerLine
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
   * @param {string}  [type=null]     the type of inner line, either 'HIP' or
   *                                  'RIDGE', default null
   */
  constructor (
    points = null, id = null, name = null, color = null, width = null,
    show = true, type = null
  ) {
    super(points, id, name, color, width, show)
    this.type = type;
  }

  /**
   * A copy constructor from an existing InnerLine object
   * @param  {InnerLine} polyline     the existing polyline object to be
   *                                  copied
   * @param  {string}   [id=polyline.entityId] unique id of the polyline,
   *                                           copy the existing one if not
   *                                           provided
   * @param  {string}   [name=null]   name of the polyline, copy the existing
   *                                  one if not provided
   * @param  {.Color}   [color=null]  GRBA color, copy the existing one if
   *                                  not provided
   * @param  {int}      [width=null]  width of the polyline, copy the
   *                                  existing one if not provided
   * @param  {Boolean}  [show=true]   whether to show the polyline, copy the
   *                                  existing one if not provided
   * @return {InnerLine}               new InnerLine object
   */
  static fromPolyline (
    polyline, id = polyline.entityId, name = null, color = null, width = null,
    show = true, type = null
  ) {
    const newPoints = polyline.points.map(elem => {
      return Point.fromPoint(elem);
    });
    const newName = name ? name : polyline.name;
    const newColor = color ? color : polyline.color;
    const newShow = show ? show : polyline.show;
    const newWidth = width ? width : polyline.width;
    const newType = type ? type : polyline.type;
    return new InnerLine (
      newPoints, id, newName, newColor, newWidth, newShow, newType
    );
  }

  /**
   * set the type of the inner line to HIP, and change its color
   */
  setTypeHip = () => {
    this.type = 'HIP';
    this.setColorbyType();
  };

  /**
   * set the type of the inner line to RIDGE, and change its color
   */
  setTypeRidge = () => {
    this.type = 'RIDGE';
    this.setColorbyType();
  };

  /**
   * set inner line color according to the type
   */
  setColorbyType = () => {
    switch (this.type) {
      case 'HIP':
        this.setColor(Color.GOLD);
        break;
      case 'RIDGE':
        this.setColor(Color.RED);
        break;
      default:
        this.setColor(Color.DARKGRAY);
    }
  }
}

export default InnerLine;
