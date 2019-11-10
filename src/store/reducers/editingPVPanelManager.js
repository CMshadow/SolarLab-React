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
  userPanels: [],
  selectPanelIndex: -1
};

const setupPanelParams = (state, action) => {
  const panelID = action.parameters.panelID;
  const selectPanelIndex = state.userPanels.reduce((findIndex, elem, i) =>
    elem.panelID === panelID ? i : findIndex, -1
  );
  return {
    ...state,
    parameters: {
      ...action.parameters
    },
    selectPanelIndex: selectPanelIndex
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

const fetchUserPanels = (state, action) => {
  return {
    ...state,
    userPanels: action.panelData
  }
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SETUP_PANEL_PARAMS:
      return setupPanelParams(state, action);
    case actionTypes.CLEAN_EDITING_PANELS:
      return cleanPanels(state, action);
    case actionTypes.INIT_EDITING_PANELS:
      return generatePanels(state, action);
    case actionTypes.FETCH_USER_PANELS:
      return fetchUserPanels(state, action);
    default: return state;
  }
};

export default reducer;
