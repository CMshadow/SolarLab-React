import uuid from 'uuid/v1';

// const capitalizeFirstLetter = (string) => {
//     return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
// };

class Keepout {

  constructor (
    id = null, type = null, drew = null, editing = null, outline = null,
    polygon = null, polygonPart2 = null, buildingBelong = null,
    roofIndexBelong = null
  ) {
    this.id = id ? id : uuid();
    this.type = type ? type : 'KEEPOUT';
    this.finishedDrawing = drew ? drew : false;
    this.isEditing = editing ? editing : false;
    this.outlinePolyline = outline ? outline : null;
    this.outlinePolygon = polygon ? polygon : null;
    this.outlinePolygonPart2 = polygonPart2 ? polygonPart2 : null;
    this.buildingBelong = buildingBelong || null;
    this.roofIndexBelong = roofIndexBelong !== null ? roofIndexBelong : null;
  }

  setFinishedDrawing = () => {
    this.finishedDrawing = true;
  }

  setIsEditing = () => {
    this.isEditing = true;
  }

  unsetIsEditing = () => {
    this.isEditing = false;
  }

  bindBuilding = (buildingId) => {
    this.buildingBelong = buildingId;
  }

  bindRoofIndex = (roofIndex) => {
    this.roofIndexBelong = roofIndex;
  }

  getOutlineCoordinates = () => {
    return this.outlinePolyline.getPointsCoordinatesArray(false);
  }

  getOutlinePart2Coordinates = () => {
    return this.outlinePolygonPart2.convertHierarchyToFoundLine()
    .getPointsCoordinatesArray(false);
  }

  static fromKeepout (keepout) {
    const newId = keepout.id;
    const newType = keepout.type;
    const newDrew = keepout.finishedDrawing;
    const newIsEditing = keepout.isEditing;
    const newBuildingBelong = keepout.buildingBelong;
    const newRoofIndexBelong = keepout.roofIndexBelong;
    return new Keepout(
      newId, newType, newDrew, newIsEditing, newBuildingBelong,
      newRoofIndexBelong
    );
  }
}

export default Keepout;
