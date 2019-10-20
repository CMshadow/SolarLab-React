import * as actionTypes from '../actions/actionTypes';

export const initEditingPanels = (allPanels) => {
  return {
    type: actionTypes.INIT_EDITING_PANELS,
    panels: allPanels
  };
}
