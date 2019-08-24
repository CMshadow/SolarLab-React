import * as actionTypes from './actionTypes';

export const startDrawing = () => {
  return {
    type: actionTypes.UI_START_DRAWING
  };
}


export const stopDrawing = () => {
  return {
    type: actionTypes.UI_STOP_DRAWING
  };
}

export const setUIStateReadyDrawing = () => {
  return {
    type: actionTypes.SET_UI_STATE_READY_DRAWING
  };
}

export const setUIStateFoundDrew = () => {
  return {
    type: actionTypes.SET_UI_STATE_FOUND_DREW
  };
}
