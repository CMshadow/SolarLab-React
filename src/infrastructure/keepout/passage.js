import uuid from 'uuid/v1';

import Keepout from './keepout';

class Passage extends Keepout {

  constructor (id = null, type = null, drew = null, editing = null,
    passageWidth = null, outline = null
  ) {
    super(id, type, drew, editing, outline);
    this.width = passageWidth ? passageWidth : 0.5;
  }

  static fromKeepout (passage, passageWidth=null, outline=null) {
    const newId = passage.id;
    const newType = passage.type;
    const newDrew = passage.finishedDrawing;
    const newIsEditing = passage.isEditing;
    const newPassageWidth = passageWidth ? passageWidth : passage.height;
    const newoutlinePolyline = outline ? outline : passage.outlinePolyline;
    return new Passage(newId, newType, newDrew, newIsEditing,
      newPassageWidth, newoutlinePolyline
    );
  }
}

export default Passage;
