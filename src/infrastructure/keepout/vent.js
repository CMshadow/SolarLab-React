import uuid from 'uuid/v1';

import Keepout from './keepout';

class Vent extends Keepout {

  constructor (
    id = null, type = null, drew = null, editing = null, brng = null,
    radius = null, angle = null, coordinate = null
  ) {
    super(id, type, drew, editing);
    this.bearing = brng ? brng : 0;
    this.radius = radius ? radius : 2;
    this.angle = angle ? angle : 180;
    this.coordinate = coordinate ? coordinate : null;
  }

  static fromKeepout (
    vent, brng = null, radius = null, angle = null, coordinate = null
  ) {
    const newId = vent.id;
    const newType = vent.type;
    const newDrew = vent.finishedDrawing;
    const newIsEditing = vent.isEditing;
    const newBearing = brng ? brng : vent.bearing;
    const newRadius = radius ? radius : vent.radius;
    const newAngle = angle ? angle : vent.angle;
    const newCoordinate = coordinate ? coordinate : vent.coordinate;
    return new Vent(newId, newType, newDrew, newIsEditing, newBearing,
      newRadius, newAngle, newCoordinate
    );
  }
}

export default Vent;
