export const isDrawingStates = (uiState) => {
  if (
    uiState === 'READY_DRAWING' ||
    uiState === 'DRAWING_FOUND' ||
    uiState === 'FOUND_DREW' ||
    uiState === 'EDITING_FOUND' ||
    uiState === 'DRAWING_INNER' ||
    uiState === 'INNER_DREW'
  ) {
    return true;
  } else {
    return false;
  }
};

export const isIdleStates = (uiState) => {
  if (uiState === 'IDLE') {
    return true;
  } else {
    return false;
  }
};

export const isWorkingFound = (uiState) => {
  if (
    uiState === 'DRAWING_FOUND' ||
    uiState === 'FOUND_DREW' ||
    uiState === 'EDITING_FOUND'
  ) {
    return true;
  } else {
    return false;
  }
};

export const isWorkingInner = (uiState) => {
  if (
    uiState === 'DRAWING_INNER' ||
    uiState === 'INNER_DREW'
  ) {
    return true;
  } else {
    return false;
  }
};

export const isFoundDrew = (uiState) => {
  if (uiState === 'FOUND_DREW' ||
    uiState === 'EDITING_FOUND' ||
    uiState === 'DRAWING_INNER' ||
    uiState === 'INNER_DREW'
  ) {
    return true;
  } else {
    return false;
  }
};

export const isInnerDrew = (uiState) => {
  if (
    uiState === 'DRAWING_INNER' ||
    uiState === 'INNER_DREW'
  ) {
    return true;
  } else {
    return false;
  }
};

export const showDrawInner = (uiState) => {
  if (uiState === 'FOUND_DREW' ||
    uiState === 'EDITING_FOUND'
  ) {
    return true;
  } else {
    return false;
  }
};
