import uuid from 'uuid/v1';

import Keepout from './keepout';

class Passage extends Keepout {

  constructor (id = null, type = null, passageWidth = null) {
    super(id, type);
    this.width = passageWidth ? passageWidth : 0.5;
  }
}

export default Passage;
