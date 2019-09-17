import uuid from 'uuid/v1';

import Keepout from './keepout';

class Vent extends Keepout {

  constructor (
    id = null, type = null, ventHt = null, ventStb = null, ventPos = null,
    ventBrng = null, radius = null, degree = null
  ) {
    super(id, type);
    this.height = ventHt ? ventHt : 0;
    this.setback = ventStb ? ventStb : 0;
    this.ventPosition = ventPos ? ventPos : null;
    this.ventBearing = ventBrng ? ventBrng : 0;
    this.radius = radius ? radius : 2;
    this.degree = degree ? degree : 180;
  }
}

export default Vent;
