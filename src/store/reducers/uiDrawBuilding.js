import * as actionTypes from '../actions/actionTypes';

const initialState = {
  uiStartDrawing: false
};

const uiStartDrawing = (state, action) => {
  return {
    ...state,
    uiStartDrawing: true
  };
}

const uiStopDrawing = (state, action) => {
  return {
    ...state,
    uiStartDrawing: false
  };
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.UI_START_DRAWING: return uiStartDrawing(state, action);
    case actionTypes.UI_STOP_DRAWING: return uiStopDrawing(state, action);
    default: return state;
  }
};

export default reducer;
