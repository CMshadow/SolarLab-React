import * as actionTypes from '../actions/actionTypes';


const initialState = {
  normalKeepout: [],
  passageKeepout: [],
  ventKeepout: [],
  treeKeepout: [],
  envKeepout: []
};

const bindAllKeepout = (state, action) => {
  const formatNormalKeepout = action.normalKeepout.map(kpt => (
    {
      keepout:kpt,
      buildingIndex:action.buildingIndex
    }
  ));
  const formatPassageKeepout = action.passageKeepout.map(kpt => (
    {
      keepout:kpt,
      buildingIndex:action.buildingIndex
    }
  ));
  const formatVentKeepout = action.ventKeepout.map(kpt => (
    {
      keepout:kpt,
      buildingIndex:action.buildingIndex
    }
  ));
  const formatTreeKeepout = action.treeKeepout.map(kpt => (
    {
      keepout:kpt,
      buildingIndex:action.buildingIndex
    }
  ));
  const formatEnvKeepout = action.envKeepout.map(kpt => (
    {
      keepout:kpt,
      buildingIndex:action.buildingIndex
    }
  ));
  
  return {
    ...state,
    normalKeepout: [...state.normalKeepout, ...formatNormalKeepout],
    passageKeepout: [...state.passageKeepout, ...formatPassageKeepout],
    ventKeepout: [...state.ventKeepout, ...formatVentKeepout],
    treeKeepout: [...state.treeKeepout, ...formatTreeKeepout],
    envKeepout: [...state.envKeepout, ...formatEnvKeepout]
  };
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.BIND_ALL_KEEPOUT:
      return bindAllKeepout(state, action);
    default: return state;
  }
};

export default reducer;
