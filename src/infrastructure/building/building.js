import uuid from 'uuid/v1';

class Building {

  constructor (name, serial, foundHt, eaveStb) {
    this.entityId = uuid()
    this.name = name;
    this.serial = serial;
    this.foundationHeight = foundHt;
    this.eaveSetback = eaveStb;
  }

}

export default Building;
