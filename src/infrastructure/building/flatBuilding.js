import uuid from 'uuid/v1';

import Building from './building';

class FlatBuilding extends Building {
  constructor (
    name, serial, foundHt, eaveStb, parapetHt, polyline=null, foundPolygons=null
  ) {
    super(name, serial, foundHt, eaveStb);
    this.type = 'FLAT';
    this.parapetHeight = parapetHt;
    this.polyline = polyline;
    this.foundationPolygons = foundPolygons;
  }

  bindFoundPolyline = (polyline) => {
    this.polyline = polyline;
  }

  /**
   *  Bind the building foudantion Polygon to the building currently working on
   */
  bindFoundPolygon = (polygon) => {
    this.foundationPolygon = polygon;
  }

  static fromBuilding (
    flatBuilding, name=null, serial=null, foundHt=null, eaveStb=null,
    parapetHt=null, polyline=null, foundPolygons=null
  ) {
    const newName = name ? name : flatBuilding.name;
    const newSerial = serial ? serial : flatBuilding.serial;
    const newFoundHt = foundHt ? foundHt : flatBuilding.foundationHeight;
    const newEaveStb = eaveStb ? eaveStb : flatBuilding.eaveSetback;
    const newParapetHt = parapetHt ? parapetHt : flatBuilding.parapetHeight;
    const newPolyline = polyline ? polyline : flatBuilding.polyline;
    const newPolygons =
      foundPolygons ?
      foundPolygons :
      flatBuilding.foundationPolygons;
    return new FlatBuilding(newName, newSerial, newFoundHt, newEaveStb,
      newParapetHt, newPolyline, newPolygons
    );
  }
}

export default FlatBuilding;
