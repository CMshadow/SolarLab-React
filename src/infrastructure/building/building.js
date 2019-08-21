import {
  Color
} from 'cesium';

class Building {

  constructor (name = null, serial = null, foundHt = null, eaveStb = null) {
    this.name = name;
    this.serial = serial;
    this.foundationHeight = foundHt ? foundHt : 5;
    this.eaveSetback = eaveStb ? eaveStb : 1;
  }
}

export default Building;
