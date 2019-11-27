import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';

const initialState = {
  userInverters: [],
};

const fetchUserInverters = (state, action) => {
  console.log(action.inverterData)
  return {
    ...state,
    userInverters: action.inverterData
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_INVERTERS:
      return fetchUserInverters(state, action);
    default: return state;
  }
};

export default reducer;
