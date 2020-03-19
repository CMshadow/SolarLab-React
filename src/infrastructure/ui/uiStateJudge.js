export const showManageBuildingPanel = (uiState) => {
  return uiState === 'MANAGE_BUILDING';
}

export const showCreateBuildingPanel = (uiState) => {
  return uiState === 'CREATE_NEW_BUILDING';
}

export const showDrawingPanel = (uiState) => {
  return (
    uiState === 'READY_DRAWING' ||
    uiState === 'DRAWING_FOUND' ||
    uiState === 'FOUND_DREW' ||
    uiState === 'EDITING_FOUND' ||
    uiState === 'DRAWING_INNER' ||
    uiState === 'INNER_DREW' ||
    uiState === 'DRAWING_KEEPOUT' ||
    uiState === 'EDITING_KEEPOUT'
  )
};

export const showEditing3DPanel = (uiState) => {
  return (
    uiState === 'EDITING_3D' ||
    uiState === 'EDITING_ROOFTOP'
  )
};

export const showSetUpPVPanel = (uiState) => {
  return (
    uiState === 'SETUP_PV'
  )
};

export const showSetUpWiringPanel = (uiState) => {
  return (
    uiState === 'SETUP_WIRING' ||
    uiState === 'EDITING_WIRING' ||
    uiState === 'DRAGGING_WIRING' ||
    uiState === 'MANUAL_WIRING'
  )
};

export const showSetUpBridgingPanel = (uiState) => {
  return (
    uiState === 'SETUP_BRIDGING' ||
    uiState === 'PLACE_INVERTER' ||
    uiState === 'READY_DRAG_INVERTER' ||
    uiState === 'DRAG_INVERTER' ||
    uiState === 'DRAW_MAIN_BRIDGING' ||
    uiState === 'EDIT_BRIDGING' ||
    uiState === 'DRAG_BRIDGING'
  )
};

export const useFoundManagerRender = (uiState) => {
  return (
    uiState === 'DRAWING_FOUND' ||
    uiState === 'FOUND_DREW' ||
    uiState === 'EDITING_FOUND'
  )
};

export const useInnerManagerRender = (uiState) => {
  return (
    uiState === 'DRAWING_INNER' ||
    uiState === 'INNER_DREW' ||
    uiState === 'DRAWING_KEEPOUT' ||
    uiState === 'EDITING_KEEPOUT'
  )
}

export const isIdleStates = (uiState) => {
  return (uiState === 'IDLE')
};

export const isWorkingFound = (uiState) => {
  return (
    uiState === 'DRAWING_FOUND' ||
    uiState === 'FOUND_DREW' ||
    uiState === 'EDITING_FOUND'
  )
};

export const isFinishedFound = (uiState) => {
  return (
    uiState === 'FOUND_DREW'
  )
}

export const isWorkingInner = (uiState) => {
  return (
    uiState === 'DRAWING_INNER' ||
    uiState === 'INNER_DREW'
  )
};

export const isFinishedInner = (uiState) => {
  return (
    uiState === 'INNER_DREW'
  )
};

export const isWorkingKeepout = (uiState) => {
  return (
    uiState === 'DRAWING_KEEPOUT' ||
    uiState === 'EDITING_KEEPOUT'
  )
};

export const isFoundDrew = (uiState) => {
  return (uiState === 'FOUND_DREW' ||
    uiState === 'EDITING_FOUND' ||
    uiState === 'DRAWING_INNER' ||
    uiState === 'INNER_DREW' ||
    uiState === 'DRAWING_KEEPOUT' ||
    uiState === 'EDITING_KEEPOUT'
  )
};

export const isInnerDrew = (uiState) => {
  return (
    uiState === 'INNER_DREW' ||
    uiState === 'DRAWING_KEEPOUT' ||
    uiState === 'EDITING_KEEPOUT'
  )
};

export const showDrawInner = (uiState) => {
  return (
    uiState === 'FOUND_DREW' ||
    uiState === 'EDITING_FOUND'
  )
};
