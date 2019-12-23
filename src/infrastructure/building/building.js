import uuid from 'uuid/v1';

class Building {

  constructor (name, serial, foundHt, eaveStb, shadow, pv, inverters) {
    this.entityId = uuid()
    this.name = name;
    this.serial = serial;
    this.foundationHeight = foundHt;
    this.eaveSetback = eaveStb;
    this.shadow = shadow;
    this.pv = pv;
    this.inverters = inverters;
  }

  bindShadow = (shadow) => {
    this.shadow = shadow;
  }

  bindPV = (pv) => {
    this.pv = pv;
  }

  bindInverters = (inverters) => {
    this.inverters = inverters;
  }

}

export default Building;
