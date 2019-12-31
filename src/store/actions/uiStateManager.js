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

export const setUIStateDrawingKeepout = () => {
  return {
    type: actionTypes.SET_UI_STATE_DRAWING_KEEPOUT
  };
};

export const setUIStateEditingKeepout = () => {
  return {
    type: actionTypes.SET_UI_STATE_EDITING_KEEPOUT
  };
};

export const setPreviousUIState = () => {
  return {
    type: actionTypes.SET_PREVIOUS_UI_STATE
  };
};

export const setUIStateEditing3D = () => {
  return {
    type: actionTypes.SET_UI_STATE_EDITING_3D
  };
};

export const setUIStateEditingRoofTop = () => {
  return {
    type: actionTypes.SET_UI_STATE_EDITING_ROOFTOP
  };
};

export const setUIStateSetUpPV = () => {
  return {
    type: actionTypes.SET_UI_STATE_SETUP_PV
  };
};

export const setUIStateSetUpWiring = () => {
  return {
    type: actionTypes.SET_UI_STATE_SETUP_WIRING
  };
};

export const setUIStateEditingWiring = () => {
  return {
    type: actionTypes.SET_UI_STATE_EDITING_WIRING
  };
};

export const setUIStateDraggingWiring = () => {
  return {
    type: actionTypes.SET_UI_STATE_DRAGGING_WIRING
  };
}

export const setUIStateManualWiring = () => {
  return {
    type: actionTypes.SET_UI_STATE_MANUAL_WIRING
  };
}

export const setUIStateSetUpBridging = () => {
  return {
    type: actionTypes.SET_UI_STATE_SETUP_BRIDGING
  };
}
