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
    uiState === 'EDITING_3D'
  )
};

export const showSetUpPVPanel = (uiState) => {
  return (
    uiState === 'SETUP_PV'
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
    uiState === 'DRAWING_INNER' ||
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
