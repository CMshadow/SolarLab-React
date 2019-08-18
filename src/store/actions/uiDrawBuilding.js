import * as actionTypes from './actionTypes';

export const startDrawing = () => {
  return {
    type: actionTypes.UI_START_DRAWING
  }
}


export const stopDrawing = () => {
  return {
    type: actionTypes.UI_STOP_DRAWING
  }
}
