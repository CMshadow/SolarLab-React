import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import Inverter from '../../infrastructure/inverter/inverter';
import Wiring from '../../infrastructure/inverter/wiring';
import Point from '../../infrastructure/point/point';

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
  currentMouseHover: null,
  lastMouseHover: null
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
    }
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
  return {
    ...state,
    pickedWiringPointPosition: state.hoverWiringPointPosition,
  }
}

const releasePickedWiringPoint = (state, action) => {
  return {
    ...state,
    pickedWiringPointPosition: null
  }
}

const releasePVPanel = (state, action) => {
  return {
    ...state
  }
}

const attachPVPanel = (state, action) => {
  return {
    ...state
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_INVERTERS:
      return fetchUserInverters(state, action);
    case actionTypes.SET_UP_INVERTER:
      return setUpInverter(state, action);
    case actionTypes.AUTO_WIRING:
      return autoWiring(state, action);
    case actionTypes.EDIT_WIRING:
      return editWiring(state, action);

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
    default: return state;
  }
};

export default reducer;
