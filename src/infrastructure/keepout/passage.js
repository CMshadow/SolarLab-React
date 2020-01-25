import Keepout from './keepout';

class Passage extends Keepout {

  constructor (id = null, type = 'PASSAGE', drew = null, editing = null,
    passageWidth = null, outline = null, polygon = null, buildingBelong = null,
    roofIndexBelong = null
  ) {
    super(
      id, type, drew, editing, outline, polygon, null, buildingBelong,
      roofIndexBelong
    );
    this.width = passageWidth !== null ? passageWidth : 0.5;
  }

  static fromKeepout (passage, passageWidth=null, outline=null, polygon=null,
    buildingBelong = null, roofIndexBelong = null
  ) {
    const newId = passage.id;
    const newType = passage.type;
    const newDrew = passage.finishedDrawing;
    const newIsEditing = passage.isEditing;
    const newPassageWidth = passageWidth ? passageWidth : passage.width;
    const newoutlinePolyline = outline ? outline : passage.outlinePolyline;
    const newOutlinePolygon = polygon ? polygon : passage.outlinePolygon;
    const newBuildingBelong = buildingBelong || passage.buildingBelong
    const newRoofIndexBelong = roofIndexBelong !== null ?
      roofIndexBelong :
      passage.roofIndexBelong;
    return new Passage(
      newId, newType, newDrew, newIsEditing, newPassageWidth,
      newoutlinePolyline, newOutlinePolygon, newBuildingBelong,
      newRoofIndexBelong
    );
  }

  getOutlineCoordinates = () => {
    return this.outlinePolygon.convertHierarchyToFoundLine()
    .getPointsCoordinatesArray(false);
  }
}

export default Passage;
