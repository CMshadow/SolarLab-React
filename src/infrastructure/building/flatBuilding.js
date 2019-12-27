import uuid from 'uuid/v1';

import Building from './building';

class FlatBuilding extends Building {
  constructor (
    name, serial, foundHt, eaveStb, parapetHt, polyline=null, foundPolygon=null,
    foundPolygonExcludeStb=null, parapetPolygon=null, shadow=null, pv=null,
    inverters=null, pvParams=null, parapetShadow=null
  ) {
    super(name, serial, foundHt, eaveStb, shadow, pv, inverters, pvParams);
    this.type = 'FLAT';
    this.parapetHeight = parapetHt;
    this.parapetShadow = parapetShadow;
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

  bindParapetShadow = (parapetShadow) => {
    this.parapetShadow = parapetShadow
  }

  static fromBuilding (
    flatBuilding, name=null, serial=null, foundHt=null, eaveStb=null,
    parapetHt=null, polyline=null, foundPolygon=null,
    foundPolygonExcludeStb=null, parapetPolygon=null, shadow=null, pv=null,
    inverters=null, pvParams=null, parapetShadow=null
  ) {
    const newName = name ? name : flatBuilding.name;
    const newSerial = serial ? serial : flatBuilding.serial;
    const newFoundHt = foundHt ? foundHt : flatBuilding.foundationHeight;
    const newEaveStb =
      eaveStb !== null ? eaveStb : flatBuilding.eaveSetback;
    const newParapetHt =
      parapetHt !== null ? parapetHt : flatBuilding.parapetHeight;
    const newPolyline = polyline ? polyline : flatBuilding.polyline;
    const newFoundPolygon =
      foundPolygon ?
      foundPolygon :
      flatBuilding.foundationPolygon;
    const newFoundPolygonExcludeStb =
      foundPolygonExcludeStb ?
      foundPolygonExcludeStb :
      flatBuilding.foundationPolygonExcludeStb;
    const newParapetPolygon =
      parapetPolygon ?
      parapetPolygon :
      flatBuilding.parapetPolygon;
    const newShadow = shadow || flatBuilding.shadow;
    const newPV = pv || flatBuilding.pv;
    const newInverters = inverters || flatBuilding.inverters;
    const newPVParams = pvParams || flatBuilding.pvParams;
    const newParapetShadow = parapetShadow || flatBuilding.parapetShadow
    return new FlatBuilding(newName, newSerial, newFoundHt, newEaveStb,
      newParapetHt, newPolyline, newFoundPolygon, newFoundPolygonExcludeStb,
      newParapetPolygon, newShadow, newPV, newInverters, newPVParams,
      newParapetShadow
    );
  }

  getRoofCoordinates = () => {
    return this.foundationPolygon.map(polygon =>
      polygon.convertHierarchyToFoundLine().getPointsCoordinatesArray(false)
    )
  };

  getRoofExcludeStbCoordinates = () => {
    console.log(this.foundationPolygonExcludeStb)
    return this.foundationPolygonExcludeStb.map(polygon =>
      polygon.convertHierarchyToFoundLine().getPointsCoordinatesArray(false)
    )
  };

  getParapetShadowCoordinates = () => {
    return Object.keys(this.parapetShadow).map(shadowId => {
      return {
        shadowCoordinates: this.parapetShadow[shadowId].polygon.convertHierarchyToFoundLine()
          .getPointsCoordinatesArray(false),
        parapetCoordinates: this.parapetShadow[shadowId].parapetPolyline
          .getPointsCoordinatesArray(false)
      }
    })
  };
}

export default FlatBuilding;
