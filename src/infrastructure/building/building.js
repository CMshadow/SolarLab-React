import uuid from 'uuid/v1';

class Building {

  constructor (name, serial, foundHt, eaveStb, shadow, pv, inverters) {
    this.entityId = uuid()
    this.name = name;
    this.serial = serial;
    this.foundationHeight = foundHt;
    this.eaveSetback = eaveStb;
    this.shadow = shadow;
    this.pv = pv;
    this.inverters = inverters;
  }

  bindShadow = (shadow) => {
    this.shadow = shadow;
  }

  bindPV = (pv) => {
    this.pv = pv;
  }

  bindInverters = (inverters) => {
    this.inverters = inverters;
  }

  getPVCoordinates = () => {
    console.log(this.pv)
    return Object.keys(this.pv).flatMap(roofIndex =>
      this.pv[roofIndex].flatMap(partial =>
        partial.flatMap(panelArray =>
          panelArray.map(panelInfo =>
            panelInfo.pv.convertHierarchyToFoundLine()
            .getPointsCoordinatesArray(false)
          )
        )
      )
    )
  }

  getWiringCoordinates = () => {
    return Object.keys(this.inverters).flatMap(roofIndex =>
      this.inverters[roofIndex].flatMap(inverter =>
        inverter.wiring.filter(wiring => wiring.polyline).map(wiring =>
          wiring.polyline.getPointsCoordinatesArray(false)
        )
      )
    )
  }

  getShadowCoordinates = () => {
    return Object.keys(this.shadow).map(shadowId =>
      this.shadow[shadowId].polygon.convertHierarchyToFoundLine()
      .getPointsCoordinatesArray(false)
    )
  }

}

export default Building;
