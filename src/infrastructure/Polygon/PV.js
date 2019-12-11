import { Color } from 'cesium';
import Polygon from './Polygon';

class PV extends Polygon {
  constructor(
    id = null,
    name = null,
    hierarchy = null,
    material = null,
    outlineColor = null
  ) {
    super(
      id, name || 'PV', null, hierarchy, null, null, material ||Color.ROYALBLUE,
      outlineColor || Color.BLACK
    );
  }
}

export default PV;
