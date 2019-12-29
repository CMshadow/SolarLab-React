import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import Inverter from '../../infrastructure/inverter/inverter';
import Wiring from '../../infrastructure/inverter/wiring';
import Point from '../../infrastructure/point/point';
import Polyline from '../../infrastructure/line/polyline';
import Coordinate from '../../infrastructure/point/coordinate';

const initialState = {
  roofSpecInverters: {},
  userInverters: [],

  editingRoofIndex: null,
  editingInverterIndex: null,
  editingWiringIndex: null,
  editingStartPoint: null,
  editingEndPoint: null,
  hoverWiringPointPosition: null,
  pickedWiringPointPosition: null,

  currentMouseDrag: null,
  lastMouseDrag: null
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
    roofSpecInverters: {
      ...state.roofSpecInverters,
      [action.roofIndex]: [...action.inverterSolutions]
    },

    editingRoofIndex: null,
    editingInverterIndex: null,
    editingWiringIndex: null,
    editingStartPoint: null,
    editingEndPoint: null,
    hoverWiringPointPosition: null,
    pickedWiringPointPosition: null,

    currentMouseDrag: null,
    lastMouseDrag: null
  }
}

const autoWiring = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.roofSpecInverters[action.roofIndex][action.inverterIndex]
  );
  newInverter.setWiring(action.wiringIndex, action.wiring);
  const roofInverters = [...state.roofSpecInverters[action.roofIndex]];
  roofInverters.splice(action.inverterIndex, 1, newInverter);
  return {
    ...state,
    roofSpecInverters: {
      ...state.roofSpecInverters,
      [action.roofIndex]: roofInverters
    }
  };
}

const manualWiring = (state, action) => {
  return {
    ...state,
    editingRoofIndex: action.roofIndex,
    editingInverterIndex: action.inverterIndex,
    editingWiringIndex: action.wiringIndex,
  };
}

const setManualWiringStart = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
  );
  console.log(action.wiring)
  newInverter.setWiring(state.editingWiringIndex, action.wiring);
  const roofInverters = [...state.roofSpecInverters[state.editingRoofIndex]];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    roofSpecInverters: {
      ...state.roofSpecInverters,
      [state.editingRoofIndex]: roofInverters
    },

    editingStartPoint: action.wiring.startPanel.getCenter(),
    editingEndPoint: action.wiring.endPanel.getCenter(),
    hoverWiringPointPosition: action.position,
    pickedWiringPointPosition: action.position
  };
}

const editWiring = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.roofSpecInverters[action.roofIndex][action.inverterIndex]
  );
  const newWiring = Wiring.fromWiring(newInverter.wiring[action.wiringIndex]);
  newWiring.polyline.setColor(Cesium.Color.RED);
  newInverter.setWiring(action.wiringIndex, newWiring);
  const roofInverters = [...state.roofSpecInverters[action.roofIndex]];
  roofInverters.splice(action.inverterIndex, 1, newInverter);
  return {
    ...state,
    roofSpecInverters: {
      ...state.roofSpecInverters,
      [action.roofIndex]: roofInverters
    },

    editingRoofIndex: action.roofIndex,
    editingInverterIndex: action.inverterIndex,
    editingWiringIndex: action.wiringIndex,
    editingStartPoint: newWiring.startPanel.getCenter(),
    editingEndPoint: newWiring.endPanel.getCenter()
  };
}

const stopEditWiring = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
  );
  const newWiring = Wiring.fromWiring(newInverter.wiring[state.editingWiringIndex]);
  newWiring.polyline.setColor(Cesium.Color.DARKORANGE);
  newInverter.setWiring(state.editingWiringIndex, newWiring);
  const roofInverters = [...state.roofSpecInverters[state.editingRoofIndex]];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    roofSpecInverters: {
      ...state.roofSpecInverters,
      [state.editingRoofIndex]: roofInverters
    },

    editingRoofIndex: null,
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
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
    .wiring[state.editingWiringIndex].allPanels;
  const PanelPoints = currentPanels.map(panel => panel.getCenter());

  const newPolyline = new Polyline(
    PanelPoints, null, null, Cesium.Color.RED
  );

  const newWiring = Wiring.fromWiring(
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
    .wiring[state.editingWiringIndex]
  );
  newWiring.polyline = newPolyline;
  const newInverter = Inverter.fromInverter(
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
  );
  newInverter.setWiring(state.editingWiringIndex, newWiring);
  const newRoofInverters = [...state.roofSpecInverters[state.editingRoofIndex]];
  newRoofInverters.splice(state.editingInverterIndex, 1, newInverter);

  return {
    ...state,
    roofSpecInverters: {
      ...state.roofSpecInverters,
      [state.editingRoofIndex]: newRoofInverters
    },
    pickedWiringPointPosition: null,
    editingStartPoint: newWiring.startPanel.getCenter(),
    editingEndPoint: newWiring.endPanel.getCenter()
  };
}

const releasePVPanel = (state, action) => {
  const currentPanels =
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
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
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
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
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
  );
  newInverter.setWiring(state.editingWiringIndex, newWiring);
  const newRoofInverters = [...state.roofSpecInverters[state.editingRoofIndex]];
  newRoofInverters.splice(state.editingInverterIndex, 1, newInverter);

  return {
    ...state,
    roofSpecInverters: {
      ...state.roofSpecInverters,
      [state.editingRoofIndex]: newRoofInverters
    },
  };
}

const attachPVPanel = (state, action) => {
  const currentPanels =
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
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
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
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
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
  );
  newInverter.setWiring(state.editingWiringIndex, newWiring);
  const newRoofInverters = [...state.roofSpecInverters[state.editingRoofIndex]];
  newRoofInverters.splice(state.editingInverterIndex, 1, newInverter);

  return {
    ...state,
    roofSpecInverters: {
      ...state.roofSpecInverters,
      [state.editingRoofIndex]: newRoofInverters
    },
  };
}

const dynamicWiringLine = (state, action) => {
  const currentWiring =
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
    .wiring[state.editingWiringIndex];
  const existPoints =
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
    .wiring[state.editingWiringIndex].polyline.points;
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
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
    .wiring[state.editingWiringIndex]
  );
  newWiring.polyline = newPolyline;
  const newInverter = Inverter.fromInverter(
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
  );
  newInverter.setWiring(state.editingWiringIndex, newWiring);
  const newRoofInverters = [...state.roofSpecInverters[state.editingRoofIndex]];
  newRoofInverters.splice(state.editingInverterIndex, 1, newInverter);

  return {
    ...state,
    roofSpecInverters: {
      ...state.roofSpecInverters,
      [state.editingRoofIndex]: newRoofInverters
    },
  };
}

const setMouseDragStatus = (state, action) => {
  return {
    ...state,
    currentMouseDrag: action.dragStatus,
    lastMouseDrag: state.currentMouseDrag
  };
}

const setBridgingRoofAndInverter = (state, action) => {
  return {
    ...state,
    editingRoofIndex: action.roofIndex,
    editingInverterIndex: action.inverterIndex
  };
}

const placeInverter = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
  );
  newInverter.polygon = action.polygon;
  newInverter.polygonCenter = action.polygonCenter;
  const roofInverters = [...state.roofSpecInverters[state.editingRoofIndex]];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    roofSpecInverters: {
      ...state.roofSpecInverters,
      [state.editingRoofIndex]: roofInverters
    }
  };
}

const bridging = (state, action) => {
  const newInverter = Inverter.fromInverter(
    state.roofSpecInverters[state.editingRoofIndex][state.editingInverterIndex]
  );
  newInverter.bridging = action.bridging;
  const roofInverters = [...state.roofSpecInverters[state.editingRoofIndex]];
  roofInverters.splice(state.editingInverterIndex, 1, newInverter);
  return {
    ...state,
    roofSpecInverters: {
      ...state.roofSpecInverters,
      [state.editingRoofIndex]: roofInverters
    }
  };
}

const dragInverter = (state, action) => {
  return {
    ...state
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
      return setBridgingRoofAndInverter(state, action);
    case actionTypes.PLACE_INVERTER:
      return placeInverter(state, action);
    case actionTypes.AUTO_BRIDGING:
      return bridging(state, action);
    case actionTypes.DRAG_INVERTER:
      return dragInverter(state, action);
    default: return state;
  }
};

export default reducer;
