import uuid from 'uuid/v1';

import Keepout from './keepout';

class Vent extends Keepout {

  constructor (
    id = null, type = null, drew = null, editing = null, brng = null,
    radius = null, angle = null, outline = null
  ) {
    super(id, type, drew, editing, outline);
    this.bearing = brng ? brng : 0;
    this.radius = radius ? radius : 2;
    this.angle = angle ? angle : 180;
  }

  static fromKeepout (
    vent, brng = null, radius = null, angle = null, outline = null
  ) {
    const newId = vent.id;
    const newType = vent.type;
    const newDrew = vent.finishedDrawing;
    const newIsEditing = vent.isEditing;
    const newBearing = brng ? brng : vent.bearing;
    const newRadius = radius ? radius : vent.radius;
    const newAngle = angle ? angle : vent.angle;
    const newoutlinePolyline = outline ? outline : vent.outlinePolyline;
    return new Vent(newId, newType, newDrew, newIsEditing, newBearing,
      newRadius, newAngle, newoutlinePolyline
    );
  }
}

export default Vent;
