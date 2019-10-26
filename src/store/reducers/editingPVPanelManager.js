import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import ProjectInfo from '../../infrastructure/projectInfo/projectInfo';

const initialState = {
  panels: [],
  parameters: {
    azimuth: 180,
    tilt: 10,
    orientation: 'portrait',
    rowSpace: 0.5,
    colSpace: 0,
    align: 'center',
    mode: 'individual',
    rowPerArray: 2,
    panelPerRow: 11
  },
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
