import uuid from 'uuid/v1';

import Building from './building';

class FlatBuilding extends Building {
  constructor (name, serial, foundHt, eaveStb, parapetHt) {
    super(name, serial, foundHt, eaveStb);
    this.type = 'FLAT';
    this.parapetHeight = parapetHt;
    this.polyline = null;
    this.foundationPolygon = null;
  }

/**
 *  Bind the building foudantion Polygon to the building currently working on
 */
  bindFoundPolygon = (Polygon) => {
    this.foundationPolygon = Polygon;
  }
}

export default FlatBuilding;
