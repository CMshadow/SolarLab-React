import uuid from 'uuid/v1';
import Wiring from './wiring';

class Inverter {
  constructor (
    entityId = null, inverterId = null, inverterName = null, serialNum = null,
    panelPerString = null, stringPerInverter = null, mpptSetup = null,
    wiring = null, bridging = null, inverterPolygon = null,
    inverterPolygonCenter = null,
  ) {
    this.entityId = entityId || uuid();
    this.inverterId = inverterId;
    this.inverterName = inverterName;
    this.serial = serialNum || 0;
    this.panelPerString = panelPerString || 0;
    this.stringPerInverter = stringPerInverter || 0;
    this.wiring = wiring ||
      Array(this.stringPerInverter).fill(0).map(elem => new Wiring());
    this.bridging = bridging || [];
    this.polygon = inverterPolygon;
    this.polygonCenter = inverterPolygonCenter;
    this.mpptSetup = mpptSetup;
  }

  static fromInverter (inverter) {
    const newEntityId = inverter.entityId;
    const newInverterId = inverter.inverterId;
    const newInverterName = inverter.inverterName;
    const newSerial = inverter.serial;
    const newPanelPerString = inverter.panelPerString;
    const newStringPerInverter = inverter.stringPerInverter;
    const newWiring = inverter.wiring;
    const newBridging = inverter.bridging;
    const newPolygon = inverter.polygon;
    const newPolygonCenter = inverter.polygonCenter;
    const newMpptSetup = inverter.mpptSetup
    return new Inverter(
      newEntityId, newInverterId, newInverterName, newSerial, newPanelPerString,
      newStringPerInverter, newMpptSetup, newWiring, newBridging, newPolygon,
      newPolygonCenter,
    )
  }

  setWiring = (wiringIndex, wiringObj) => {
    this.wiring.splice(wiringIndex, 1, wiringObj);
  }
}

export default Inverter;
