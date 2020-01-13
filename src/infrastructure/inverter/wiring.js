import uuid from 'uuid/v1';

import Polyline from '../line/polyline';

class Wiring {
  constructor (
    entityId = null, startPanel = null, endPanel = null, allPanels = null,
    polyline = null, panelRows=null
  ) {
    this.entityId = entityId || uuid();
    this.startPanel = startPanel;
    this.endPanel = endPanel;
    this.allPanels = allPanels || [];
    this.polyline = polyline;
    this.panelRows = panelRows
  }

  static fromWiring (wiring) {
    const newEntityId = wiring.entityId;
    const startPanel = wiring.startPanel;
    const endPanel = wiring.endPanel;
    const allPanels = wiring.allPanels;
    const newPolyline = Polyline.fromPolyline(wiring.polyline);
    const newPanelRows = wiring.panelRows;
    return new Wiring(
      newEntityId, startPanel, endPanel, allPanels, newPolyline, newPanelRows
    );
  }
}

export default Wiring;
