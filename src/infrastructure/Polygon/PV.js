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
