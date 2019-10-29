import uuid from 'uuid/v1';

import Keepout from './keepout';

class Tree extends Keepout {

  constructor (
    id = null, type = null, drew = null, editing = null, ventHt = null,
    radius = null, outline = null
  ) {
    super(id, type, drew, editing, outline);
    this.height = ventHt ? ventHt : 0;
    this.radius = radius ? radius : 5;
  }

  static fromKeepout (
    tree, height = null, radius = null, outline = null
  ) {
    const newId = tree.id;
    const newType = tree.type;
    const newDrew = tree.finishedDrawing;
    const newIsEditing = tree.isEditing;
    const newHt = height ? height : tree.height;
    const newRadius = radius ? radius : tree.radius;
    const newoutlinePolyline = outline ? outline : tree.outlinePolyline;
    return new Tree(newId, newType, newDrew, newIsEditing, newHt, newRadius,
      newoutlinePolyline
    );
  }
}

export default Tree;
