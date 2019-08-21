import uuid from 'uuid/v1';

import Building from './building';

class FlatBuilding extends Building {
  constructor (name, serial, foundHt, eaveStb, parapetHt) {
    super(name, serial, foundHt, eaveStb);
    this.type = 'FLAT';
    this.parapetHeight = parapetHt ? parapetHt : 0;
    this.polyline = null;
  }
}

export default FlatBuilding;
