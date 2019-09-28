import uuid from 'uuid/v1';

import Keepout from './keepout';

class Vent extends Keepout {

  constructor (
    id = null, type = null, drew = null, editing = null, brng = null,
    radius = null, angle = null, outline = null, polygon = null
  ) {
    super(id, type, drew, editing, outline, polygon);
    this.bearing = brng ? brng : 0;
    this.radius = radius ? radius : 2;
    this.angle = angle ? angle : 180;
  }

  static fromKeepout (
    vent, brng = null, radius = null, angle = null, outline = null,
    polygon = null
  ) {
    const newId = vent.id;
    const newType = vent.type;
    const newDrew = vent.finishedDrawing;
    const newIsEditing = vent.isEditing;
    const newBearing = brng ? brng : vent.bearing;
    const newRadius = radius ? radius : vent.radius;
    const newAngle = angle ? angle : vent.angle;
    const newOutlinePolyline = outline ? outline : vent.outlinePolyline;
    const newOutlinePolygon = polygon ? polygon : vent.outlinePolygon
    return new Vent(newId, newType, newDrew, newIsEditing, newBearing,
      newRadius, newAngle, newOutlinePolyline, newOutlinePolygon
    );
  }
}

export default Vent;
