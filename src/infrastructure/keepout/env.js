import uuid from 'uuid/v1';

import Keepout from './keepout';

class Env extends Keepout {

  constructor (id = null, type = null, drew=null, editing=null, envHt = null,
    outline = null
  ) {
    super(id, type, drew, editing, outline);
    this.height = envHt ? envHt : 0;
  }

  static fromKeepout (
    normalKeepout, keepoutHt=null, outline=null
  ) {
    const newId = normalKeepout.id;
    const newType = normalKeepout.type;
    const newDrew = normalKeepout.finishedDrawing;
    const newIsEditing = normalKeepout.isEditing;
    const newKeepoutHt = keepoutHt ? keepoutHt : normalKeepout.height;
    const newoutlinePolyline = outline ? outline : normalKeepout.outlinePolyline;
    return new Env(newId, newType, newDrew, newIsEditing, newKeepoutHt,
      newoutlinePolyline
    );
  }
}

export default Env;
