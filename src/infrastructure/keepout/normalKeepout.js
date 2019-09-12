import uuid from 'uuid/v1';

import Keepout from './keepout';

class NormalKeepout extends Keepout {

  constructor (id = null, type = null, keepoutHt = null, keepoutStb = null) {
    super(id, type);
    this.height = keepoutHt ? keepoutHt : 0;
    this.setback = keepoutStb ? keepoutStb : 0;
  }
}

export default NormalKeepout;
