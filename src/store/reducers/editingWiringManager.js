import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';

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

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_INVERTERS:
      return fetchUserInverters(state, action);
    case actionTypes.SET_UP_INVERTER:
      return setUpInverter(state, action);
    default: return state;
  }
};

export default reducer;
