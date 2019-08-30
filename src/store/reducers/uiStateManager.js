import * as actionTypes from '../actions/actionTypes';

const initialState = {
  uiState: 'IDLE',
};

const setUIStateDrawingFound = (state, action) => {
  return {
    ...state,
    uiState: 'DRAWING_FOUND'
  }
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
    case actionTypes.SET_UI_STATE_READY_DRAWING:
      return setUIStateReadyDrawing(state, action);
    case actionTypes.SET_UI_STATE_DRAWING_FOUND:
      return setUIStateDrawingFound(state, action);
    case actionTypes.SET_UI_STATE_FOUND_DREW:
      return setUIStateFoundDrew(state, action);
    default: return state;
  }
};

export default reducer;
