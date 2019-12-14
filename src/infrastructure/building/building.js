import uuid from 'uuid/v1';

class Building {

  constructor (name, serial, foundHt, eaveStb, shadow) {
    this.entityId = uuid()
    this.name = name;
    this.serial = serial;
    this.foundationHeight = foundHt;
    this.eaveSetback = eaveStb;
    this.shadow = shadow
  }

  bindShadow = (shadow) => {
    this.shadow = shadow;
  }

}

export default Building;
