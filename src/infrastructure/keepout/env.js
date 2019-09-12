import uuid from 'uuid/v1';

import Keepout from './keepout';

class Env extends Keepout {

  constructor (id = null, type = null, envHt = null) {
    super(id, type);
    this.height = envHt ? envHt : 0;
  }
}

export default Env;
