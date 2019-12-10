import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import PV from '../../infrastructure/Polygon/PV';

const initialState = {
  panels: {},
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
  roofSpecParams: {},
  userPanels: [],
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
    roofSpecParams: {
      ...state.roofSpecParams,
      [action.roofIndex]: {
        ...state.parameters,
        ...action.parameters,
        selectPanelIndex: selectPanelIndex
      }
    },
  };
}

const generatePanels = (state, action) => {
  return {
    ...state,
    panels: {
      ...state.panels,
      [action.roofIndex]: action.panels
    }
  }
};

const cleanPanels = (state, action) => {
  return {
    ...state,
    panels: {
      ...state.panels,
      [action.roofIndex]: []
    }
  };
}

const fetchUserPanels = (state, action) => {
  return {
    ...state,
    userPanels: action.panelData
  }
}

const updatePVConnected = (state, action) => {
  const connectedPanelId = action.wiring.allPanels.map(pv => pv.entityId);
  const newPanels = {...state.panels};
  const changes = newPanels[action.roofIndex].map(partial =>
    partial.map(panelArray =>
      panelArray.map(panel => {
        if (connectedPanelId.includes(panel.pv.entityId)) {
          const newPV = PV.copyPolygon(panel.pv);
          newPV.setConnected();
          return {
            ...panel,
            pv: newPV
          };
        } else {
          return panel;
        }
      })
    )
  );
  newPanels[action.roofIndex] = changes;
  return {
    ...state,
    panels: newPanels
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
    case actionTypes.FETCH_USER_PANELS:
      return fetchUserPanels(state, action);
    case actionTypes.AUTO_WIRING:
      return updatePVConnected(state, action);
    default: return state;
  }
};

export default reducer;
