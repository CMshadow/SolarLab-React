import { Color } from 'cesium';
import Polygon from './Polygon';
import Point from '../point/point';

class PV extends Polygon {
  constructor(
    id = null,
    name = null,
    hierarchy = null,
    material = null,
    outlineColor = null,
    connected = false
  ) {
    super(
      id, name || 'PV', null, hierarchy, null, null,
      material ||Color.ROYALBLUE.withAlpha(0.75),
      outlineColor || Color.BLACK
    );
    this.connected = connected;
  }

  getCenter = (HtOffset = 0.1) => {
    const point1 = new Point(
      this.hierarchy[0], this.hierarchy[1], this.hierarchy[2]
    );
    const point2 = new Point(
      this.hierarchy[6], this.hierarchy[7], this.hierarchy[8]
    );
    const brng = Point.bearing(point1, point2);
    const dist = Point.surfaceDistance(point1, point2);
    const center = Point.destination(point1, brng, dist / 2);
    center.setCoordinate(
      null, null, point1.height +(point2.height - point1.height) / 2 + HtOffset
    );
    return Point.fromCoordinate(center);
  }

  static copyPolygon (pv) {
    const newEntityId = pv.entityId;
    const newName = pv.name;
    const newHierarchy = pv.hierarchy;
    const newMaterial = pv.material;
    const newOutlineColor = pv.outlineColor;
    const newConnected = pv.conntected;
    return new PV(
      newEntityId, newName, newHierarchy, newMaterial, newOutlineColor, newConnected
    )
  }

  setConnected = () => {
    this.connected = true;
  }

  releaseConnected = () => {
    this.connected = false;
  }
}

export default PV;
