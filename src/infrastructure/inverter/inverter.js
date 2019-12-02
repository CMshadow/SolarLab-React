import uuid from 'uuid/v1';

class Inverter {
  constructor (
    inverterId = null, inverterName = null, serialNum = null,
    panelPerString = null, stringPerInverter = null, wiring = null,
    bridging = null, inverterPolygon = null, inverterPolygonCenter = null
  ) {
    this.entityId = uuid();
    this.inverterId = inverterId;
    this.inverterName = inverterName;
    this.serial = serialNum || 0;
    this.panelPerString = panelPerString || 0;
    this.stringPerInverter = stringPerInverter || 0;
    this.wiring = wiring || Array(this.stringPerInverter).fill(0);
    this.bridging = bridging || [];
    this.polygon = inverterPolygon;
    this.polygonCenter = inverterPolygonCenter;
  }
}

export default Inverter;
