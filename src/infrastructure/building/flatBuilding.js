import uuid from 'uuid/v1';

import Building from './building';

class FlatBuilding extends Building {
  constructor (
    name, serial, foundHt, eaveStb, parapetHt, polyline=null, foundPolygon=null,
    foundPolygonExcludeStb=null, parapetPolygon=null
  ) {
    super(name, serial, foundHt, eaveStb);
    this.type = 'FLAT';
    this.parapetHeight = parapetHt;
    this.polyline = polyline;
    this.foundationPolygon = foundPolygon;
    this.foundationPolygonExcludeStb = foundPolygonExcludeStb;
    this.parapetPolygon = parapetPolygon;
  }

  bindFoundPolyline = (polyline) => {
    this.polyline = polyline;
  }

  /**
   *  Bind the building foudantion Polygon to the building currently working on
   */
  bindFoundPolygon = (foundPolygon) => {
    this.foundationPolygon = foundPolygon;
  }

  bindFoundPolygonExcludeStb = (foundPolygonExcludeStb) => {
    this.foundationPolygonExcludeStb = foundPolygonExcludeStb;
  }

  bindParapetPolygon = (parapetPolygon) => {
    this.parapetPolygon = parapetPolygon;
  }

  static fromBuilding (
    flatBuilding, name=null, serial=null, foundHt=null, eaveStb=null,
    parapetHt=null, polyline=null, foundPolygon=null,
    foundPolygonExcludeStb=null, parapetPolygon=null
  ) {
    const newName = name ? name : flatBuilding.name;
    const newSerial = serial ? serial : flatBuilding.serial;
    const newFoundHt = foundHt ? foundHt : flatBuilding.foundationHeight;
    const newEaveStb = eaveStb ? eaveStb : flatBuilding.eaveSetback;
    const newParapetHt = parapetHt ? parapetHt : flatBuilding.parapetHeight;
    const newPolyline = polyline ? polyline : flatBuilding.polyline;
    const newFoundPolygon =
      foundPolygon ?
      foundPolygon :
      flatBuilding.foundationPolygon;
    const newFoundPolygonExcludeStb =
      foundPolygonExcludeStb ?
      foundPolygonExcludeStb :
      flatBuilding.foundPolygonExcludeStb;
    const newParapetPolygon =
      parapetPolygon ?
      parapetPolygon :
      flatBuilding.parapetPolygon;
    return new FlatBuilding(newName, newSerial, newFoundHt, newEaveStb,
      newParapetHt, newPolyline, newFoundPolygon, newFoundPolygonExcludeStb,
      newParapetPolygon
    );
  }
}

export default FlatBuilding;
