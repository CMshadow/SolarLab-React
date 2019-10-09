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

  bindFoundPolyline = (polyline) => {
    this.polyline = polyline;
  }

  /**
   *  Bind the building foudantion Polygon to the building currently working on
   */
  bindFoundPolygon = (polygon) => {
    this.foundationPolygon = polygon;
  }
}

export default FlatBuilding;
