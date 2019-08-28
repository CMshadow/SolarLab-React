import * as actionTypes from '../actions/actionTypes';

const initialState = {
  uiState: 'IDLE',
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

const setUIStateReadyDrawing = (state, action) => {
  return {
    ...state,
    uiState: 'READY_DRAWING'
  }
}

const setUIStateFoundDrew = (state, action) => {
  return {
    ...state,
    uiState: 'FOUND_DREW'
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.UI_START_DRAWING: return uiStartDrawing(state, action);
    case actionTypes.UI_STOP_DRAWING: return uiStopDrawing(state, action);
    case actionTypes.SET_UI_STATE_READY_DRAWING: return setUIStateReadyDrawing(state, action);
    case actionTypes.SET_UI_STATE_FOUND_DREW: return setUIStateFoundDrew(state, action);
    default: return state;
  }
};

export default reducer;
