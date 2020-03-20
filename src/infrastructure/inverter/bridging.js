import uuid from 'uuid/v1';

import Polyline from '../line/polyline';

class Bridging {
  constructor (
    entityId = null, mainPolyline = null, subPolyline = null,
    anchorPanelMap = null, connectedWiringIndex=null
  ) {
    this.entityId = entityId || uuid();
    this.mainPolyline = mainPolyline;
    this.subPolyline = subPolyline;
    this.anchorPanelMap = anchorPanelMap;
    this.connectedWiringIndex = connectedWiringIndex;
  }

  static fromBridging (bridging) {
    const newEntityId = bridging.entityId;
    const newMainPolyline = Polyline.fromPolyline(bridging.mainPolyline);
    const newSubPolyline = bridging.subPolyline ?
      bridging.subPolyline.map(sub =>Polyline.fromPolyline(sub)) : null;
    const newAnchorPanelMap = bridging.anchorPanelMap;
    const newConnectedWiringIndex = bridging.connectedWiringIndex;
    return new Bridging(
      newEntityId, newMainPolyline, newSubPolyline, newAnchorPanelMap,
      newConnectedWiringIndex
    );
  }
}

export default Bridging;
