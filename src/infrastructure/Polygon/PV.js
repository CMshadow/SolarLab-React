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
      id, name || 'PV', null, hierarchy, null, null, material ||Color.ROYALBLUE,
      outlineColor || Color.BLACK
    );
    this.connected = connected;
  }

  setConnected = () => {
    this.connected = true;
  }

  releaseConnected = () => {
    this.connected = false;
  }
}

export default PV;
