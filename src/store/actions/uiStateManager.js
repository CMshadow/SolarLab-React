import * as actionTypes from './actionTypes';

export const setUIStateIdel = () => {
  return {
    type: actionTypes.SET_UI_STATE_IDLE
  };
}

export const setUIStateManageBuilding = () => {
  return {
    type: actionTypes.SET_UI_STATE_MANAGE_BUILDING
  };
}

export const setUIStateCreateNewBuilding = () => {
  return {
    type: actionTypes.SET_UI_STATE_CREATE_NEW_BUILDING
  };
}

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

export const setUIStatePlaceInverter = () => {
  return {
    type: actionTypes.SET_UI_STATE_PLACE_INVERTER
  };
}

export const setUIStateReadyDragInverter = () => {
  return {
    type: actionTypes.SET_UI_STATE_READY_DRAG_INVERTER
  };
}

export const setUIStateDragInverter = () => {
  return {
    type: actionTypes.SET_UI_STATE_DRAG_INVERTER
  };
}

export const setUIStateDrawMainBridging = () => {
  return {
    type: actionTypes.SET_UI_STATE_DRAW_MAIN_BRIDGING
  };
}

export const setUIStateEditBridging = () => {
  return {
    type: actionTypes.SET_UI_STATE_EDIT_BRIDGING
  };
}

export const setUIStateDragBridging = () => {
  return {
    type: actionTypes.SET_UI_STATE_DRAG_BRIDGING
  };
}
