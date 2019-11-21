import * as actionTypes from '../actions/actionTypes';


const initialState = {
  debugPolylines: [],
  debugPoints: [],
  debugPolygons: [],
  debugShadowPolygons: []
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

const setDebugPolygons = (state, action) => {
  return {
    ...state,
    debugPolygons: action.debugPolygons
  };
};

const setDebugShadowPolygons = (state, action) => {
  return {
    ...state,
    debugShadowPolygons: action.debugShadowPolygons
  };
};


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_DEBUGPOLYLINES: return setDebugPolylines(state, action);
    case actionTypes.SET_DEBUGPOINTS: return setDebugPoints(state, action);
    case actionTypes.SET_DEBUGPOLYGONS: return setDebugPolygons(state, action);
    case actionTypes.SET_DEBUGSHADOWPOLYGONS:
      return setDebugShadowPolygons(state, action)
    default: return state;
  }
};

export default reducer;
