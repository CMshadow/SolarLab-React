import * as actionTypes from '../actions/actionTypes';


const initialState = {
  workingBuilding: null
};


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_BUILDING: return state;
    default: return state;
  }
};

export default reducer;
