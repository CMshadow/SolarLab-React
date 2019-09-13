import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';

const initialState = {
  keepoutList: []
};

const createKeepout = (state, action) => {
  return {
    ...state,
    initialForm: false,
    keepoutList: [...state.keepoutList, action.newKeepout]
  };
};

const updateKeepout = (state, action) => {
  const newKeepoutList = [...state.keepoutList];
  newKeepoutList.splice(action.updateIndex, 1, action.updateKeepout);
  return {
    ...state,
    keepoutList: newKeepoutList
  }
};

const deleteKeepout = (state, action) => {
  const newKeepoutList = [...state.keepoutList];
  newKeepoutList.splice(action.deleteIndex, 1);
  return {
    ...state,
    keepoutList: newKeepoutList
  }
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_KEEPOUT:
      return createKeepout (state, action);
    case actionTypes.UPDATE_KEEPOUT:
      return updateKeepout (state, action);
    case actionTypes.DELETE_KEEPOUT:
      return deleteKeepout (state, action);
    default: return state;
  }
};

export default reducer;
