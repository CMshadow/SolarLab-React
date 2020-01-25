import Keepout from './keepout';

class NormalKeepout extends Keepout {

  constructor (
    id=null, type='KEEPOUT', drew=null, editing=null, keepoutHt=null,
    keepoutStb=null, outline=null, polygon=null, polygonPart2=null,
    buildingBelong=null, roofIndexBelong=null
  ) {
    super(id, type, drew, editing, outline, polygon, polygonPart2,
      buildingBelong, roofIndexBelong
    );
    this.height = keepoutHt ? keepoutHt : 0;
    this.setback = keepoutStb ? keepoutStb : 0;
  }

  static fromKeepout (
    normalKeepout, keepoutHt=null, keepoutStb=null, outline=null, polygon=null,
    polygonPart2 = null, buildingBelong=null, roofIndexBelong=null
  ) {
    const newId = normalKeepout.id;
    const newType = normalKeepout.type;
    const newDrew = normalKeepout.finishedDrawing;
    const newIsEditing = normalKeepout.isEditing;
    const newKeepoutHt = keepoutHt !== null ? keepoutHt : normalKeepout.height;
    const newKeepoutStb =
      keepoutStb !== null ?
      keepoutStb :
      normalKeepout.setback;
    const newOutlinePolyline = outline ? outline : normalKeepout.outlinePolyline;
    const newOutlinePolygon = polygon ? polygon : normalKeepout.outlinePolygon;
    const newOutlinePolygonPart2 =
      polygonPart2 ?
      polygonPart2 :
      normalKeepout.outlinePolygonPart2;
    const newBuildingBelong = buildingBelong || normalKeepout.buildingBelong;
    const newRoofIndexBelong = roofIndexBelong !== null ?
      roofIndexBelong :
      normalKeepout.roofIndexBelong;
    return new NormalKeepout(
      newId, newType, newDrew, newIsEditing, newKeepoutHt, newKeepoutStb,
      newOutlinePolyline, newOutlinePolygon, newOutlinePolygonPart2,
      newBuildingBelong, newRoofIndexBelong
    );
  }
}

export default NormalKeepout;
