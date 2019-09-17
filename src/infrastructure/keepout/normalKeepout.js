import uuid from 'uuid/v1';

import Keepout from './keepout';

class NormalKeepout extends Keepout {

  constructor (id = null, type = null, keepoutHt = null, keepoutStb = null) {
    super(id, type);
    this.height = keepoutHt ? keepoutHt : 0;
    this.setback = keepoutStb ? keepoutStb : 0;
  }

  static fromKeepout (normalKeepout, keepoutHt, keepoutStb) {
    const newId = normalKeepout.id;
    const newType = normalKeepout.type;
    const newKeepoutHt = keepoutHt ? keepoutHt : normalKeepout.height;
    const newKeepoutStb = keepoutStb ? keepoutStb : normalKeepout.setback;
    return new NormalKeepout(newId, newType, newKeepoutHt, newKeepoutStb);
  }
}

export default NormalKeepout;
