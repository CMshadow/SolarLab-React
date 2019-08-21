import uuid from 'uuid/v1';

import Building from './building';

class PitchedBuilding extends Building {
  constructor (name, serial, foundHt, eaveStb, hipStb, ridgeStb) {
    super(name, serial, foundHt, eaveStb);
    this.type = 'PITCHED';
    this.hipSetback = hipStb ? hipStb : 1;
    this.ridgeSetback = ridgeStb ? ridgeStb : 1;
  }
}

export default PitchedBuilding;
