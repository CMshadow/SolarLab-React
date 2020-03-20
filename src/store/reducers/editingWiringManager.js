import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import Inverter from '../../infrastructure/inverter/inverter';
import Wiring from '../../infrastructure/inverter/wiring';
import Bridging from '../../infrastructure/inverter/bridging';
import Point from '../../infrastructure/point/point';
import Polyline from '../../infrastructure/line/polyline';
import Coordinate from '../../infrastructure/point/coordinate';

const initialState = {
  entireSpecInverters: [],
  userInverters: [],

  editingInverterIndex: null,
  editingWiringIndex: null,
  editingStartPoint: null,
  editingEndPoint: null,
  hoverWiringPointPosition: null,
  pickedWiringPointPosition: null,

  currentMouseDrag: null,
  lastMouseDrag: null,

  hoverInverterCenter: null,

  editingBridgingIndex: null,
  editingBridgingPointIndex: null,
  editingBridgingMainPolylineIndex: null
};

const fetchUserInverters = (state, action) => {
  return {
    ...state,
    userInverters: action.inverterData
  }
}

const setUpInverter = (state, action) => {
  return {
    ...state,
    entireSpecInverters: [...action.inverterSolutions],

    editingInverterIndex: null,
    editingWiringIndex: null,
    editingStartPoint: null,
    editingEndPoint: null,
    hoverWiringPointPosition: null,
    pickedWiringPointPosition: null,

    currentMouseDrag: null,
  }
}

const autoWiring = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[action.inverterIndex]
  );
  newInverter.setWiring(action.wiringIndex, action.wiring);
  const roofInverters = [...state.entireSpecInverters];
  roofInverters.splice(action.inverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: roofInverters
  };
}

const manualWiring = (state, action) => {
  return {
    ...state,
    editingInverterIndex: action.inverterIndex,
    editingWiringIndex: action.wiringIndex,
  };
}

const setManualWiringStart = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingInverterIndex]
  );
  newInverter.setWiring(state.editingWiringIndex, action.wiring);
  const roofInverters = [...state.entireSpecInverters];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: roofInverters,

    editingStartPoint: action.wiring.startPanel.getCenter(),
    editingEndPoint: action.wiring.endPanel.getCenter(),
    hoverWiringPointPosition: action.position,
    pickedWiringPointPosition: action.position
  };
}

const editWiring = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[action.inverterIndex]
  );
  const newWiring = Wiring.fromWiring(newInverter.wiring[action.wiringIndex]);
  newWiring.polyline.setColor(Cesium.Color.RED);
  newInverter.setWiring(action.wiringIndex, newWiring);
  const roofInverters = [...state.entireSpecInverters];
  roofInverters.splice(action.inverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: roofInverters,

    editingInverterIndex: action.inverterIndex,
    editingWiringIndex: action.wiringIndex,
    editingStartPoint: newWiring.startPanel.getCenter(),
    editingEndPoint: newWiring.endPanel.getCenter()
  };
}

const stopEditWiring = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingInverterIndex]
  );
  const newWiring = Wiring.fromWiring(newInverter.wiring[state.editingWiringIndex]);
  newWiring.polyline.setColor(Cesium.Color.DARKORANGE);
  newInverter.setWiring(state.editingWiringIndex, newWiring);
  const roofInverters = [...state.entireSpecInverters];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: roofInverters,

    editingInverterIndex: null,
    editingWiringIndex: null,
    editingStartPoint: null,
    editingEndPoint: null,
    hoverWiringPointPosition: null,
    pickedWiringPointPosition: null,

    currentMouseDrag: null,
    lastMouseDrag: null
  };
}

const setHoverWiringPoint = (state, action) => {
  let newPoint = null;
  if (action.position === 'START') {
    newPoint = Point.fromPoint(state.editingStartPoint);
  } else {
    newPoint = Point.fromPoint(state.editingEndPoint);
  }
  newPoint.setColor(Cesium.Color.ORANGE);
  return {
    ...state,
    editingStartPoint: action.position === 'START' ? newPoint : state.editingStartPoint,
    editingEndPoint: action.position === 'END' ? newPoint : state.editingEndPoint,
    hoverWiringPointPosition: action.position,
  }
}

const releaseHoverWiringPoint = (state, action) => {
  let newPoint = null;
  if (state.hoverWiringPointPosition === 'START') {
    newPoint = Point.fromPoint(state.editingStartPoint);
  } else {
    newPoint = Point.fromPoint(state.editingEndPoint);
  }
  newPoint.setColor(Cesium.Color.WHITE);
  return {
    ...state,
    editingStartPoint:
      state.hoverWiringPointPosition === 'START' ?
      newPoint :
      state.editingStartPoint,
    editingEndPoint:
      state.hoverWiringPointPosition === 'END' ?
      newPoint :
      state.editingEndPoint,
    hoverWiringPointPosition: null
  }
}

const setPickedWiringPoint = (state, action) => {
  if (state.hoverWiringPointPosition === 'START') {
    return {
      ...state,
      pickedWiringPointPosition: state.hoverWiringPointPosition,
      editingStartPoint: null
    };
  } else {
    return {
      ...state,
      pickedWiringPointPosition: state.hoverWiringPointPosition,
      editingEndPoint: null
    };
  }
}

const releasePickedWiringPoint = (state, action) => {
  const currentPanels =
    state.entireSpecInverters[state.editingInverterIndex]
    .wiring[state.editingWiringIndex].allPanels;
  const PanelPoints = currentPanels.map(panel => panel.getCenter());

  const newPolyline = new Polyline(
    PanelPoints, null, null, Cesium.Color.RED
  );

  const newWiring = Wiring.fromWiring(
    state.entireSpecInverters[state.editingInverterIndex]
    .wiring[state.editingWiringIndex]
  );
  newWiring.polyline = newPolyline;
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingInverterIndex]
  );
  newInverter.setWiring(state.editingWiringIndex, newWiring);
  const newRoofInverters = [...state.entireSpecInverters];
  newRoofInverters.splice(state.editingInverterIndex, 1, newInverter);

  return {
    ...state,
    entireSpecInverters: newRoofInverters,
    pickedWiringPointPosition: null,
    editingStartPoint: newWiring.startPanel.getCenter(),
    editingEndPoint: newWiring.endPanel.getCenter()
  };
}

const releasePVPanel = (state, action) => {
  const currentPanels =
    state.entireSpecInverters[state.editingInverterIndex]
    .wiring[state.editingWiringIndex].allPanels;
  const PanelPoints = currentPanels.map(panel => panel.getCenter());

  let newPolyline = null;
  let newPanels = null;
  if (state.pickedWiringPointPosition === 'START') {
    newPolyline = new Polyline(
      [...PanelPoints.slice(1,)], null, null, Cesium.Color.RED
    );
    newPanels = currentPanels.slice(1,);
  } else {
    newPolyline = new Polyline(
      [...PanelPoints.slice(0,-1)], null, null, Cesium.Color.RED
    );
    newPanels = currentPanels.slice(0, -1);
  }

  const newWiring = Wiring.fromWiring(
    state.entireSpecInverters[state.editingInverterIndex]
    .wiring[state.editingWiringIndex]
  );
  newWiring.polyline = newPolyline;
  newWiring.allPanels = newPanels;
  if (state.pickedWiringPointPosition === 'START') {
    newWiring.startPanel = newPanels[0];
    newWiring.panelRows.splice(0, 1);
  } else {
    newWiring.endPanel = newPanels.slice(-1)[0];
    newWiring.panelRows.splice(-1, 1);
  }
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingInverterIndex]
  );
  newInverter.setWiring(state.editingWiringIndex, newWiring);
  const newRoofInverters = [...state.entireSpecInverters];
  newRoofInverters.splice(state.editingInverterIndex, 1, newInverter);

  return {
    ...state,
    entireSpecInverters: newRoofInverters,
  };
}

const attachPVPanel = (state, action) => {
  const currentPanels =
    state.entireSpecInverters[state.editingInverterIndex]
    .wiring[state.editingWiringIndex].allPanels;
  const PanelPoints = currentPanels.map(panel => panel.getCenter());

  let newPolyline = null;
  let newPanels = null;
  if (state.pickedWiringPointPosition === 'START') {
    newPolyline = new Polyline(
      [action.panelInfo.center, ...PanelPoints], null, null, Cesium.Color.RED
    );
    newPanels = [action.panelInfo.pv, ...currentPanels];
  } else {
    newPolyline = new Polyline(
      [...PanelPoints, action.panelInfo.center], null, null, Cesium.Color.RED
    );
    newPanels = [...currentPanels, action.panelInfo.pv];
  }

  const newWiring = Wiring.fromWiring(
    state.entireSpecInverters[state.editingInverterIndex]
    .wiring[state.editingWiringIndex]
  );
  newWiring.polyline = newPolyline;
  newWiring.allPanels = newPanels;
  if (state.pickedWiringPointPosition === 'START') {
    newWiring.startPanel = newPanels[0];
    newWiring.panelRows.splice(0, 0, action.panelInfo.row)
  } else {
    newWiring.endPanel = newPanels.slice(-1)[0];
    newWiring.panelRows.push(action.panelInfo.row)
  }
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingInverterIndex]
  );
  newInverter.setWiring(state.editingWiringIndex, newWiring);
  const newRoofInverters = [...state.entireSpecInverters];
  newRoofInverters.splice(state.editingInverterIndex, 1, newInverter);

  return {
    ...state,
    entireSpecInverters: newRoofInverters,
  };
}

const dynamicWiringLine = (state, action) => {
  const currentWiring =
    state.entireSpecInverters[state.editingInverterIndex]
    .wiring[state.editingWiringIndex];
  const existPoints = currentWiring.polyline.points;
  const newPoint = Point.fromCoordinate(
    Coordinate.fromCartesian(action.cartesian3)
  );
  let newPolyline = null;
  if (state.pickedWiringPointPosition === 'START') {
    existPoints.length === currentWiring.allPanels.length ?
    newPolyline = new Polyline(
      [newPoint, ...existPoints], null, null, Cesium.Color.RED
    ) :
    newPolyline = new Polyline(
      [newPoint, ...existPoints.slice(1,)], null, null, Cesium.Color.RED
    );
  } else {
    existPoints.length === currentWiring.allPanels.length ?
    newPolyline = new Polyline(
      [...existPoints, newPoint], null, null, Cesium.Color.RED
    ) :
    newPolyline = new Polyline(
      [...existPoints.slice(0,-1), newPoint], null, null, Cesium.Color.RED
    );
  }

  const newWiring = Wiring.fromWiring(
    state.entireSpecInverters[state.editingInverterIndex]
    .wiring[state.editingWiringIndex]
  );
  newWiring.polyline = newPolyline;
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingInverterIndex]
  );
  newInverter.setWiring(state.editingWiringIndex, newWiring);
  const newRoofInverters = [...state.entireSpecInverters];
  newRoofInverters.splice(state.editingInverterIndex, 1, newInverter);

  return {
    ...state,
    entireSpecInverters: newRoofInverters,
  };
}

const setMouseDragStatus = (state, action) => {
  return {
    ...state,
    currentMouseDrag: action.dragStatus,
    lastMouseDrag: state.currentMouseDrag
  };
}

const setBridgingInverter = (state, action) => {
  return {
    ...state,
    editingInverterIndex: action.inverterIndex
  };
}

const placeInverter = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingInverterIndex]
  );
  newInverter.polygon = action.polygon;
  newInverter.polygonCenter = action.polygonCenter;
  newInverter.mainBridging = new Bridging(null, new Polyline(
    [action.polygonCenter], null, null, Cesium.Color.SLATEBLUE
  ))
  const roofInverters = [...state.entireSpecInverters];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: roofInverters
  };
}

const bridging = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[action.roofIndex][action.inverterIndex]
  );
  newInverter.bridging = action.bridging;
  const roofInverters = [...state.entireSpecInverters[action.roofIndex]];
  roofInverters.splice(action.inverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: {
      ...state.entireSpecInverters,
      [action.roofIndex]: roofInverters
    }
  };
}

const setHoverInverterCenter = (state, action) => {
  const newPoint = Point.fromPoint(
    state.entireSpecInverters[state.editingInverterIndex].polygonCenter
  );
  newPoint.setColor(Cesium.Color.ORANGE);
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingInverterIndex]
  );
  newInverter.polygonCenter = newPoint;
  const roofInverters = [...state.entireSpecInverters];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: roofInverters,
    hoverInverterCenter: true
  };
}

const releaseHoverInverterCenter = (state, action) => {
  const newPoint = Point.fromPoint(
    state.entireSpecInverters[state.editingInverterIndex].polygonCenter
  );
  newPoint.setColor(Cesium.Color.DARKCYAN);
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingInverterIndex]
  );
  newInverter.polygonCenter = newPoint;
  const roofInverters = [...state.entireSpecInverters];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: roofInverters,
    hoverInverterCenter: null,
  };
}

const dragInverter = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingInverterIndex]
  );
  const newMainBridging = Bridging.fromBridging(newInverter.mainBridging);
  const newBridging = newInverter.bridging.map(bridging => {
    const newBridge = Bridging.fromBridging(bridging);
    newBridge.mainPolyline = Polyline.fromPolyline(newBridge.mainPolyline);
    newBridge.mainPolyline.points.splice(0, 1, action.polygonCenter);
    return newBridge;
  })
  newMainBridging.mainPolyline.points.splice(0, 1, action.polygonCenter);
  newInverter.polygon = action.polygon;
  newInverter.polygonCenter = action.polygonCenter;
  newInverter.bridging = newBridging;
  newInverter.mainBridging = newMainBridging;
  const roofInverters = [...state.entireSpecInverters];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: roofInverters
  };
}

const updateMainBridging = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingInverterIndex]
  );
  newInverter.mainBridging = action.mainBridging;
  const newRoofInverters = [...state.entireSpecInverters];
  newRoofInverters.splice(state.editingInverterIndex, 1, newInverter);

  return {
    ...state,
    entireSpecInverters: newRoofInverters,
  };
}

const setHoverBridgingPoint = (state, action) => {
  const newPoint = Point.fromPoint(
    state.entireSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
    .bridging[action.bridgingIndex].mainPolyline.points[action.bridgingPointIndex]
  );
  newPoint.setColor(Cesium.Color.ORANGE);
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
  );
  newInverter.bridging[action.bridgingIndex].mainPolyline.points.splice(
    action.bridgingPointIndex, 1, newPoint
  );
  const roofInverters = [...state.entireSpecInverters[state.editingRoofIndex]];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: {
      ...state.entireSpecInverters,
      [state.editingRoofIndex]: roofInverters,
    },
    editingBridgingIndex: action.bridgingIndex,
    editingBridgingPointIndex: action.bridgingPointIndex
  };
}

const releaseHoverBridgingPoint = (state, action) => {
  const newPoint = Point.fromPoint(
    state.entireSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
    .bridging[state.editingBridgingIndex].mainPolyline
    .points[state.editingBridgingPointIndex]
  );
  newPoint.setColor(Cesium.Color.DARKCYAN);
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
  );
  newInverter.bridging[state.editingBridgingIndex].mainPolyline.points.splice(
    state.editingBridgingPointIndex, 1, newPoint
  );
  const roofInverters = [...state.entireSpecInverters[state.editingRoofIndex]];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: {
      ...state.entireSpecInverters,
      [state.editingRoofIndex]: roofInverters,
    },
    editingBridgingIndex: null,
    editingBridgingPointIndex: null
  };
}

const dragBridgingPoint = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
  );
  const newBridging = newInverter.bridging.map(bridging =>
    Bridging.fromBridging(bridging)
  );
  newBridging[state.editingBridgingIndex].mainPolyline.points.splice(
    state.editingBridgingPointIndex, 1, action.point
  );
  newInverter.bridging = newBridging;
  const roofInverters = [...state.entireSpecInverters[state.editingRoofIndex]];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: {
      ...state.entireSpecInverters,
      [state.editingRoofIndex]: roofInverters
    }
  };
}

const setHoverBridgingMainPolyline = (state, action) => {
  const newPolyline = Polyline.fromPolyline(
    state.entireSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
    .bridging[action.bridgingMainPolylineIndex].mainPolyline
  );
  newPolyline.setColor(Cesium.Color.ORANGE);
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
  );
  newInverter.bridging[action.bridgingMainPolylineIndex].mainPolyline =
  newPolyline;
  const roofInverters = [...state.entireSpecInverters[state.editingRoofIndex]];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: {
      ...state.entireSpecInverters,
      [state.editingRoofIndex]: roofInverters,
    },
    editingBridgingMainPolylineIndex: action.bridgingMainPolylineIndex,
  };
}

const releaseHoverBridgingMainPolyline = (state, action) => {
  const newPolyline = Polyline.fromPolyline(
    state.entireSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
    .bridging[state.editingBridgingMainPolylineIndex].mainPolyline
  );
  newPolyline.setColor(Cesium.Color.DARKCYAN);
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
  );
  newInverter.bridging[state.editingBridgingMainPolylineIndex].mainPolyline =
  newPolyline;
  const roofInverters = [...state.entireSpecInverters[state.editingRoofIndex]];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: {
      ...state.entireSpecInverters,
      [state.editingRoofIndex]: roofInverters,
    },
    editingBridgingMainPolylineIndex: null,
  };
}

const complementPointOnBridging = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
  );
  const newBridging = newInverter.bridging.map(bridging =>
    Bridging.fromBridging(bridging)
  );
  newBridging[state.editingBridgingMainPolylineIndex].mainPolyline.points.splice(
    action.indexToAdd, 0, action.point
  );
  newBridging[state.editingBridgingMainPolylineIndex].anchorPanelMap =
  newBridging[state.editingBridgingMainPolylineIndex].anchorPanelMap.map(obj =>
    obj.anchorIndex >= action.indexToAdd ?
    {...obj, anchorIndex: obj.anchorIndex + 1} :
    obj
  );
  newInverter.bridging = newBridging;
  const roofInverters = [...state.entireSpecInverters[state.editingRoofIndex]];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: {
      ...state.entireSpecInverters,
      [state.editingRoofIndex]: roofInverters
    }
  };
}

const highLightWiring = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[action.inverterIndex]
  );
  const newWiring = Wiring.fromWiring(newInverter.wiring[action.wiringIndex]);
  newWiring.polyline.setColor(Cesium.Color.RED);
  newInverter.setWiring(action.wiringIndex, newWiring);
  const roofInverters = [...state.entireSpecInverters];
  roofInverters.splice(action.inverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: roofInverters
  };
}

const highLightInverter = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[action.inverterIndex]
  );
  newInverter.wiring.forEach((wiring, wiringIndex) => {
    const newWiring = Wiring.fromWiring(wiring);
    newWiring.polyline.setColor(Cesium.Color.RED);
    newInverter.setWiring(wiringIndex, newWiring);
  })
  const roofInverters = [...state.entireSpecInverters];
  roofInverters.splice(action.inverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: roofInverters
  };
}

const deHighLightWiring = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[action.inverterIndex]
  );
  const newWiring = Wiring.fromWiring(newInverter.wiring[action.wiringIndex]);
  newWiring.polyline.setColor(Cesium.Color.ORANGE);
  newInverter.setWiring(action.wiringIndex, newWiring);
  const roofInverters = [...state.entireSpecInverters];
  roofInverters.splice(action.inverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: roofInverters
  };
}

const deHighLightInverter = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.entireSpecInverters[action.inverterIndex]
  );
  newInverter.wiring.forEach((wiring, wiringIndex) => {
    const newWiring = Wiring.fromWiring(wiring);
    newWiring.polyline.setColor(Cesium.Color.ORANGE);
    newInverter.setWiring(wiringIndex, newWiring);
  })
  const roofInverters = [...state.entireSpecInverters];
  roofInverters.splice(action.inverterIndex, 1, newInverter);
  return {
    ...state,
    entireSpecInverters: roofInverters
  };
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_INVERTERS:
      return fetchUserInverters(state, action);
    case actionTypes.SET_UP_INVERTER:
      return setUpInverter(state, action);
    case actionTypes.AUTO_WIRING:
      return autoWiring(state, action);
    case actionTypes.MANUAL_WIRING:
      return manualWiring(state, action);
    case actionTypes.MANUAL_WIRING_START:
      return setManualWiringStart(state, action);
    case actionTypes.EDIT_WIRING:
      return editWiring(state, action);
    case actionTypes.STOP_EDIT_WIRING:
      return stopEditWiring(state, action);

    case actionTypes.SET_HOVER_WIRING_POINT:
      return setHoverWiringPoint(state, action);
    case actionTypes.RELEASE_HOVER_WIRING_POINT:
      return releaseHoverWiringPoint(state, action);
    case actionTypes.SET_PICKED_WIRING_POINT:
      return setPickedWiringPoint(state, action);
    case actionTypes.RELEASE_PICKED_WIRING_POINT:
      return releasePickedWiringPoint(state, action);
    case actionTypes.RELEASE_PV_PANEL:
      return releasePVPanel(state, action);
    case actionTypes.ATTACH_PV_PANEL:
      return attachPVPanel(state, action);
    case actionTypes.DYNAMIC_WIRING_LINE:
      return dynamicWiringLine(state, action);
    case actionTypes.SET_MOUSE_DRAG_STATUS:
      return setMouseDragStatus(state, action);
    case actionTypes.SET_BRIDGING_ROOF_AND_INVERTER:
      return setBridgingInverter(state, action);
    case actionTypes.PLACE_INVERTER:
      return placeInverter(state, action);
    case actionTypes.AUTO_BRIDGING:
      return bridging(state, action);
    case actionTypes.SET_HOVER_INVERTER_CENTER:
      return setHoverInverterCenter(state, action);
    case actionTypes.RELEASE_HOVER_INVERTER_CENTER:
      return releaseHoverInverterCenter(state, action);
    case actionTypes.DRAG_INVERTER:
      return dragInverter(state, action);
    case actionTypes.DYNAMIC_MAIN_BRIDGING:
      return updateMainBridging(state, action);
    case actionTypes.ADD_POINT_ON_MAIN_BRIDGING:
      return updateMainBridging(state, action);
    case actionTypes.TERMINATE_DRAW_MAIN_BRIDGING:
      return updateMainBridging(state, action);
    case actionTypes.SET_HOVER_BRIDGING_POINT:
      return setHoverBridgingPoint(state, action);
    case actionTypes.RELEASE_HOVER_BRIDGING_POINT:
      return releaseHoverBridgingPoint(state, action);
    case actionTypes.DRAG_BRIDGING_POINT:
      return dragBridgingPoint(state, action);
    case actionTypes.SET_HOVER_BRIDGING_MAIN_POLYLINE:
      return setHoverBridgingMainPolyline(state, action);
    case actionTypes.RELEASE_HOVER_BRIDGING_MAINPOLYLINE:
      return releaseHoverBridgingMainPolyline(state, action);
    case actionTypes.COMPLEMENT_POINT_ON_BRIDGING:
      return complementPointOnBridging(state, action);

    case actionTypes.HIGHLIGHT_WIRING:
      return highLightWiring(state, action);
    case actionTypes.DE_HIGHLIGHT_WIRING:
      return deHighLightWiring(state, action);
    case actionTypes.HIGHLIGHT_INVERTER:
      return highLightInverter(state, action);
    case actionTypes.DE_HIGHLIGHT_INVERTER:
      return deHighLightInverter(state, action);

    default:
      return state;
  }
};

export default reducer;
