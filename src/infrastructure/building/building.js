import uuid from 'uuid/v1';

class Building {

  constructor (name, serial, foundHt, eaveStb, shadow, pv, inverters, pvParams) {
    this.entityId = uuid()
    this.name = name;
    this.serial = serial;
    this.foundationHeight = foundHt;
    this.eaveSetback = eaveStb;
    this.shadow = shadow;
    this.pv = pv || {};
    this.inverters = inverters || [];
    this.pvParams = pvParams || {};
  }

  bindShadow = (shadow) => {
    this.shadow = shadow;
  }

  bindPV = (pv) => {
    this.pv = pv;
  }

  bindPVParams = (pvParams) => {
    this.pvParams = pvParams;
  }

  bindPVRoofSpecParams = (roofSpecParams) => {
    this.pvParams = roofSpecParams;
  }

  bindInverters = (inverters) => {
    this.inverters = inverters;
  }

  getPVCoordinates = () => {
    return Object.keys(this.pv).flatMap(roofIndex =>
      Object.keys(this.pv[roofIndex]).map(panelId =>
        this.pv[roofIndex][panelId].pv.convertHierarchyToFoundLine()
        .getPointsCoordinatesArray(false)
      )
    )
  }

  getWiringCoordinates = () => {
    return this.inverters.flatMap(inverter =>
      inverter.wiring.filter(wiring => wiring.polyline).map(wiring =>
        wiring.polyline.getPointsCoordinatesArray(false)
      )
    )
  }

  getShadowCoordinates = () => {
    return Object.keys(this.shadow).map(shadowId => {
      return {
        shadowCoordinates: this.shadow[shadowId].polygon.convertHierarchyToFoundLine()
          .getPointsCoordinatesArray(false),
        keepoutCoordinates: this.shadow[shadowId].keepoutCoordinates,
        keepoutType: this.shadow[shadowId].type,
      }
    }).filter(obj => obj.keepoutCoordinates.length > 2)
  }

}

export default Building;
