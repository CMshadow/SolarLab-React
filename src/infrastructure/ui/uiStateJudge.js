export const showDrawingPanel = (uiState) => {
  if (
    uiState === 'READY_DRAWING' ||
    uiState === 'DRAWING_FOUND' ||
    uiState === 'FOUND_DREW' ||
    uiState === 'EDITING_FOUND' ||
    uiState === 'DRAWING_INNER' ||
    uiState === 'INNER_DREW' ||
    uiState === 'DRAWING_KEEPOUT' ||
    uiState === 'EDITING_KEEPOUT'
  ) {
    return true;
  } else {
    return false;
  }
};

export const useFoundManagerRender = (uiState) => {
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

export const useInnerManagerRender = (uiState) => {
  if (
    uiState === 'DRAWING_INNER' ||
    uiState === 'INNER_DREW' ||
    uiState === 'DRAWING_KEEPOUT' ||
    uiState === 'EDITING_KEEPOUT'
  ) {
    return true;
  } else {
    return false;
  }
}

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

export const isFinishedFound = (uiState) => {
  if (
    uiState === 'FOUND_DREW'
  ) {
    return true;
  } else {
    return false;
  }
}

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

export const isFinishedInner = (uiState) => {
  if (
    uiState === 'INNER_DREW'
  ) {
    return true;
  } else {
    return false;
  }
};

export const isWorkingKeepout = (uiState) => {
  if (
    uiState === 'DRAWING_KEEPOUT' ||
    uiState === 'EDITING_KEEPOUT'
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
    uiState === 'INNER_DREW' ||
    uiState === 'DRAWING_KEEPOUT' ||
    uiState === 'EDITING_KEEPOUT'
  ) {
    return true;
  } else {
    return false;
  }
};

export const isInnerDrew = (uiState) => {
  if (
    uiState === 'DRAWING_INNER' ||
    uiState === 'INNER_DREW' ||
    uiState === 'DRAWING_KEEPOUT' ||
    uiState === 'EDITING_KEEPOUT'
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
