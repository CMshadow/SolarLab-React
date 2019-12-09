import uuid from 'uuid/v1';

class Wiring {
  constructor (
    startPanel = null, endPanel = null, allPanels = null, polyline = null
  ) {
    this.entityId = uuid();
    this.startPanel = startPanel;
    this.endPanel = endPanel;
    this.allPanels = allPanels || [];
    this.polyline = polyline;
  }
}

export default Wiring;
