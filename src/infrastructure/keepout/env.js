import Keepout from './keepout';

class Env extends Keepout {

  constructor (id = null, type = 'ENV', drew=null, editing=null, envHt = null,
    outline = null, polygon = null
  ) {
    super(id, type, drew, editing, outline, polygon);
    this.height = envHt ? envHt : 0;
  }

  static fromKeepout (
    env, keepoutHt=null, outline=null, polygon=null
  ) {
    const newId = env.id;
    const newType = env.type;
    const newDrew = env.finishedDrawing;
    const newIsEditing = env.isEditing;
    const newKeepoutHt = keepoutHt ? keepoutHt : env.height;
    const newOutlinePolyline = outline ? outline : env.outlinePolyline;
    const newOutlinePolygon = polygon ? polygon : env.outlinePolygon;
    return new Env(newId, newType, newDrew, newIsEditing, newKeepoutHt,
      newOutlinePolyline, newOutlinePolygon
    );
  }
}

export default Env;
