import {
  Color
} from 'cesium';

class Building {

  constructor (name = null, serial = null, foundHt = null, eaveStb = null) {
    this.name = name;
    this.serial = serial;
    this.foundationHeight = foundHt;
    this.eaveSetback = eaveStb;
  }
}

export default Building;
