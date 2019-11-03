import Time from '../Time/time';
import * as MathHelper from '../math/sunPositionCalculation';

class Building {

  constructor (name, serial, foundHt, eaveStb) {
    this.name = name;
    this.serial = serial;
    this.foundationHeight = foundHt;
    this.eaveSetback = eaveStb;
    this.location = [-117.841232,33.647001];
    this.time = new Time(2019, 6, 23, 10, 16, -7);
  }

}

export default Building;
