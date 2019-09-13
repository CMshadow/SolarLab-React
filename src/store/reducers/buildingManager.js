import * as actionTypes from '../actions/actionTypes';


const initialState = {
  workingBuilding: null,
  buildingInfoFields: {
    name: null,
    type: 'FLAT',
    mode: '2D',
    foundHt: 5,
    parapetHt: 1,
    eaveStb: 1,
    hipStb: 1,
    ridgeStb: 1
  }
};

const initBuilding = (state, action) => {
  return {
    ...state,
    workingBuilding: action.buildingObj
  };
};

const saveFields = (state, action) => {
  return {
    ...state,
    buildingInfoFields: {
      ...state.buildingInfoFields,
      ...action.values,
    }
  };
};


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SAVE_BUILDING_INFO_FIELDS: return saveFields(state, action);
    case actionTypes.INIT_BUILDING: return initBuilding(state, action);
    default: return state;
  }
};

export default reducer;
