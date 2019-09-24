import * as actionTypes from '../actions/actionTypes';


const initialState = {
  debugPolylines: [],
  debugPoints: []
};

const setDebugPolylines = (state, action) => {
  console.log(action.debugPolylines)
  return {
    ...state,
    debugPolylines: action.debugPolylines
  };
};

const setDebugPoints = (state, action) => {
  return {
    ...state,
    debugPoints: action.debugPoints
  };
};


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_DEBUGPOLYLINES: return setDebugPolylines(state, action);
    case actionTypes.SET_DEBUGPOINTS: return setDebugPoints(state, action);
    default: return state;
  }
};

export default reducer;
