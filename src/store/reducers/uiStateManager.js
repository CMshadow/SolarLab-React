import * as actionTypes from '../actions/actionTypes';

const initialState = {
  lastUIState: null,
  uiState: 'IDLE',
};

const setUIStateIdel = (state, action) => {
  return {
    ...state,
    uiState: 'IDLE'
  };
}

const setUIStateManageBuilding = (state, action) => {
  return {
    ...state,
    uiState: 'MANAGE_BUILDING'
  }
}

const setUIStateCreateNewBuilding = (state, action) => {
  return {
    ...state,
    uiState: 'CREATE_NEW_BUILDING'
  };
}

const setUIStateDrawingFound = (state, action) => {
  return {
    ...state,
    uiState: 'DRAWING_FOUND'
  };
};

const setUIStateReadyDrawing = (state, action) => {
  return {
    ...state,
    uiState: 'READY_DRAWING'
  };
};

const setUIStateFoundDrew = (state, action) => {
  return {
    ...state,
    uiState: 'FOUND_DREW'
  };
};

const setUIStateEditingFound = (state, action) => {
  return {
    ...state,
    uiState: 'EDITING_FOUND'
  };
};

const setUIStateDrawingInner = (state, action) => {
  return {
    ...state,
    uiState: 'DRAWING_INNER'
  };
};

const setUIStateInnerDrew = (state,action) => {
  return {
    ...state,
    uiState: 'INNER_DREW'
  };
};

const setUIStateDrawingKeepout = (state,action) => {
  return {
    ...state,
    lastUIState: state.uiState,
    uiState: 'DRAWING_KEEPOUT'
  };
};

const setUIStateEditingKeepout = (state,action) => {
  return {
    ...state,
    lastUIState: state.lastUIState ? state.lastUIState : state.uiState,
    uiState: 'EDITING_KEEPOUT'
  };
};

const setPreviousUIState = (state, action) => {
  if (state.lastUIState === 'INNER_DREW') {
    return {
      ...state,
      lastUIState: null,
      uiState: 'INNER_DREW'
    };
  } else {
    return {
      ...state,
      lastUIState: null,
      uiState: 'FOUND_DREW'
    };
  }
};

const setUIstateEditing3D = (state,action) => {
  return {
    ...state,
    uiState: 'EDITING_3D'
  };
};

const setUIStateEditingRoofTop = (state,action) => {
  return {
    ...state,
    uiState: 'EDITING_ROOFTOP'
  };
};

const setUIStateSetUpPV = (state, action) => {
  return {
    ...state,
    uiState: 'SETUP_PV'
  };
};

const setUIStateSetUpWiring = (state, action) => {
  return {
    ...state,
    uiState: 'SETUP_WIRING'
  };
};

const setUIStateEditingWiring = (state, action) => {
  return {
    ...state,
    uiState: 'EDITING_WIRING'
  };
}

const setUIStateDraggingWiring = (state, action) => {
  return {
    ...state,
    uiState: 'DRAGGING_WIRING'
  };
}

const setUIStateManualWiring = (state, action) => {
  return {
    ...state,
    uiState: 'MANUAL_WIRING'
  };
}

const setUIStateSetUpBridging = (state, action) => {
  return {
    ...state,
    uiState: 'SETUP_BRIDGING'
  };
}

const setUIStatePlaceInverter = (state, action) => {
  return {
    ...state,
    uiState: 'PLACE_INVERTER'
  };
}

const setUIStateReadyDragInverter = (state, action) => {
  return {
    ...state,
    uiState: 'READY_DRAG_INVERTER'
  };
}

const setUIStateDragInverter = (state, action) => {
  return {
    ...state,
    uiState: 'DRAG_INVERTER'
  };
}

const setUIStateDrawMainBridging = (state, action) => {
  return {
    ...state,
    uiState: 'DRAW_MAIN_BRIDGING',
  };
}

const setUIStateEditMainBridging = (state, action) => {
  return {
    ...state,
    uiState: 'EDIT_MAIN_BRIDGING',
  };
}

const setUIStateEditBridging = (state, action) => {
  return {
    ...state,
    uiState: 'EDIT_BRIDGING',
  };
}

const setUIStateDragBridging = (state, action) => {
  return {
    ...state,
    uiState: 'DRAG_BRIDGING',
  };
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_UI_STATE_IDLE:
      return setUIStateIdel(state, action);
    case actionTypes.SET_UI_STATE_MANAGE_BUILDING:
      return setUIStateManageBuilding(state, action);
    case actionTypes.SET_UI_STATE_CREATE_NEW_BUILDING:
      return setUIStateCreateNewBuilding(state, action);
    case actionTypes.SET_UI_STATE_READY_DRAWING:
      return setUIStateReadyDrawing(state, action);
    case actionTypes.SET_UI_STATE_DRAWING_FOUND:
      return setUIStateDrawingFound(state, action);
    case actionTypes.SET_UI_STATE_FOUND_DREW:
      return setUIStateFoundDrew(state, action);
    case actionTypes.SET_UI_STATE_EDITING_FOUND:
      return setUIStateEditingFound(state, action);
    case actionTypes.SET_UI_STATE_DRAWING_INNER:
      return setUIStateDrawingInner(state, action);
    case actionTypes.SET_UI_STATE_INNER_DREW:
      return setUIStateInnerDrew(state, action);
    case actionTypes.SET_UI_STATE_DRAWING_KEEPOUT:
      return setUIStateDrawingKeepout(state, action);
    case actionTypes.SET_UI_STATE_EDITING_KEEPOUT:
      return setUIStateEditingKeepout(state, action);
    case actionTypes.SET_PREVIOUS_UI_STATE:
      return setPreviousUIState(state, action);
    case actionTypes.SET_UI_STATE_EDITING_3D:
      return setUIstateEditing3D(state, action);
    case actionTypes.SET_UI_STATE_EDITING_ROOFTOP:
      return setUIStateEditingRoofTop(state, action);
    case actionTypes.SET_UI_STATE_SETUP_PV:
      return setUIStateSetUpPV(state, action);
    case actionTypes.SET_UI_STATE_SETUP_WIRING:
      return setUIStateSetUpWiring(state, action);
    case actionTypes.SET_UI_STATE_EDITING_WIRING:
      return setUIStateEditingWiring(state, action);
    case actionTypes.SET_UI_STATE_DRAGGING_WIRING:
      return setUIStateDraggingWiring(state, action);
    case actionTypes.SET_UI_STATE_MANUAL_WIRING:
      return setUIStateManualWiring(state, action);
    case actionTypes.SET_UI_STATE_SETUP_BRIDGING:
      return setUIStateSetUpBridging(state, action);
    case actionTypes.SET_UI_STATE_PLACE_INVERTER:
      return setUIStatePlaceInverter(state, action);
    case actionTypes.SET_UI_STATE_READY_DRAG_INVERTER:
      return setUIStateReadyDragInverter(state, action);
    case actionTypes.SET_UI_STATE_DRAG_INVERTER:
      return setUIStateDragInverter(state, action);
    case actionTypes.SET_UI_STATE_DRAW_MAIN_BRIDGING:
      return setUIStateDrawMainBridging(state, action);
    case actionTypes.SET_UI_STATE_EDIT_MAIN_BRIDGING:
      return setUIStateEditMainBridging(state, action);
    case actionTypes.SET_UI_STATE_EDIT_BRIDGING:
      return setUIStateEditBridging(state, action);
    case actionTypes.SET_UI_STATE_DRAG_BRIDGING:
      return setUIStateDragBridging(state, action);
    default: return state;
  }
};

export default reducer;
