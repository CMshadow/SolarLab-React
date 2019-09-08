import * as actionTypes from './actionTypes';

export const setUIStateReadyDrawing = () => {
  return {
    type: actionTypes.SET_UI_STATE_READY_DRAWING
  };
}

export const setUIStateDrawingFound = () => {
  return {
    type: actionTypes.SET_UI_STATE_DRAWING_FOUND
  };
};

export const setUIStateFoundDrew = () => {
  return {
    type: actionTypes.SET_UI_STATE_FOUND_DREW
  };
};

export const setUIStateEditingFound = () => {
  return {
    type: actionTypes.SET_UI_STATE_EDITING_FOUND
  };
};

export const setUIStateDrawingInner = () => {
  return {
    type: actionTypes.SET_UI_STATE_DRAWING_INNER
  };
};

export const setUIStateInnerDrew = () => {
  return {
    type: actionTypes.SET_UI_STATE_INNER_DREW
  };
};
