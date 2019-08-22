import * as actionTypes from '../actions/actionTypes';


const initialState = {
  workingBuilding: null,
  buildingInfoFields: {
    name: null,
    type: 'FLAT',
    mode3D: false,
    foundHt: 5,
    parapetHt: 1,
    eaveStb: 1,
    hipStb: 1,
    ridgeStb: 1
  }
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
    case actionTypes.INIT_BUILDING: return state;
    case actionTypes.SAVE_BUILDING_INFO_FIELDS: return saveFields(state, action)
    default: return state;
  }
};

export default reducer;
