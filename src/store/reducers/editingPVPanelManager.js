import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import ProjectInfo from '../../infrastructure/projectInfo/projectInfo';

const initialState = {
  panels: [],
};

const initEditingPanels = (state, action) => {
  return {
    ...state,
    panels: action.panels
  }
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_EDITING_PANELS:
      return initEditingPanels(state, action);
    default: return state;
  }
};

export default reducer;
