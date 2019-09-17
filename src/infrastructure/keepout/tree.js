import uuid from 'uuid/v1';

import Keepout from './keepout';

class Tree extends Keepout {

  constructor (
    id = null, type = null, ventHt = null, treePos = null, radius = null
  ) {
    super(id, type);
    this.height = ventHt ? ventHt : 0;
    this.treePosition = treePos ? treePos : null;
    this.radius = radius ? radius : 5;
  }
}

export default Tree;
