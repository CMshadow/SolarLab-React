import uuid from 'uuid/v1';

import Keepout from './keepout';

class NormalKeepout extends Keepout {

  constructor (
    id=null, type=null, drew=null, editing=null, keepoutHt=null,
    keepoutStb=null, outline=null
  ) {
    super(id, type, drew, editing);
    this.height = keepoutHt ? keepoutHt : 0;
    this.setback = keepoutStb ? keepoutStb : 0;
    this.outlinePolyline = outline ? outline : null;
  }



  static fromKeepout (
    normalKeepout, keepoutHt=null, keepoutStb=null, outline=null
  ) {
    const newId = normalKeepout.id;
    const newType = normalKeepout.type;
    const newDrew = normalKeepout.finishedDrawing;
    const newIsEditing = normalKeepout.isEditing;
    const newKeepoutHt = keepoutHt ? keepoutHt : normalKeepout.height;
    const newKeepoutStb = keepoutStb ? keepoutStb : normalKeepout.setback;
    const newoutlinePolyline = outline ? outline : normalKeepout.outlinePolyline;
    return new NormalKeepout(newId, newType, newDrew, newIsEditing,
      newKeepoutHt, newKeepoutStb, newoutlinePolyline
    );
  }
}

export default NormalKeepout;
