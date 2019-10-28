import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import ProjectInfo from '../../infrastructure/projectInfo/projectInfo';

const initialState = {
  panels: [],
  backendLoading: false,
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

const setupPanelParams = (state, action) => {
  return {
    ...state,
    parameters: {
      ...action.parameters
    }
  };
}

const generatePanels = (state, action) => {
  return {
    ...state,
    panels: action.panels
  }
};

const cleanPanels = (state, action) => {
  return {
    ...state,
    panels: []
  };
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SETUP_PANEL_PARAMS:
      return setupPanelParams(state, action);
    case actionTypes.CLEAN_EDITING_PANELS:
      return cleanPanels(state, action);
    case actionTypes.INIT_EDITING_PANELS:
      return generatePanels(state, action);
    default: return state;
  }
};

export default reducer;
