import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import Inverter from '../../infrastructure/inverter/inverter';

const initialState = {
  roofSpecInverters: {},
  userInverters: [],
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

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_INVERTERS:
      return fetchUserInverters(state, action);
    case actionTypes.SET_UP_INVERTER:
      return setUpInverter(state, action);
    case actionTypes.AUTO_WIRING:
      return autoWiring(state, action);
    default: return state;
  }
};

export default reducer;
