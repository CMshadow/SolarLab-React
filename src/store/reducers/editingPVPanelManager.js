import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import PV from '../../infrastructure/Polygon/PV';

const initialState = {
  panels: {},
  connectedPanelId: [],
  disconnectedPanelId: [],

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
      [action.roofIndex]: {}
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
  const disconnectedPanelIds = [...state.disconnectedPanelId];
  const connectedPanelIds = [...state.connectedPanelId];
  const wiringPanelIds = action.wiring.allPanels.map(pv => pv.entityId);
  const newPanels = {...state.panels};
  Object.keys(newPanels).forEach(roofIndex => {
    Object.keys(newPanels[roofIndex]).forEach(panelId => {
      if (wiringPanelIds.includes(panelId)) {
        const newPV = PV.copyPolygon(newPanels[roofIndex][panelId].pv);
        newPV.setConnected();
        newPanels[roofIndex][panelId].pv = newPV;

        disconnectedPanelIds.splice(disconnectedPanelIds.indexOf(panelId), 1 );
        connectedPanelIds.push(panelId);
      }
    })
  })


  return {
    ...state,
    panels: newPanels,
    connectedPanelId: connectedPanelIds,
    disconnectedPanelId: disconnectedPanelIds
  };
}

const setPVConnected = (state, action) => {
  const disconnectedPanelIds = [...state.disconnectedPanelId];
  const connectedPanelIds = [...state.connectedPanelId];
  const newPanels = {...state.panels};
  Object.keys(newPanels).forEach(roofIndex => {
    if (action.panelId in newPanels[roofIndex]) {
      const newPV = PV.copyPolygon(newPanels[roofIndex][action.panelId].pv);
      newPV.setConnected();
      newPanels[roofIndex][action.panelId].pv = newPV;

      disconnectedPanelIds.splice(
        disconnectedPanelIds.indexOf(action.panelId), 1
      );
      connectedPanelIds.push(action.panelId);
    }
  })

  return {
    ...state,
    panels: newPanels,
    connectedPanelId: connectedPanelIds,
    disconnectedPanelId: disconnectedPanelIds
  };
}

const setPVDisConnected = (state, action) => {
  const disconnectedPanelIds = [...state.disconnectedPanelId];
  const connectedPanelIds = [...state.connectedPanelId];
  const newPanels = {...state.panels};
  Object.keys(newPanels).forEach(roofIndex => {
    if (action.panelId in newPanels[roofIndex]) {
      const newPV = PV.copyPolygon(newPanels[roofIndex][action.panelId].pv);
      newPV.releaseConnected();
      newPanels[roofIndex][action.panelId].pv = newPV;

      connectedPanelIds.splice(connectedPanelIds.indexOf(action.panelId), 1);
      disconnectedPanelIds.push(action.panelId);
    }
  })

  return {
    ...state,
    panels: newPanels,
    connectedPanelId: connectedPanelIds,
    disconnectedPanelId: disconnectedPanelIds
  };
}

const setRoofAllPVDisConnected = (state, action) => {
  const disconnectedPanelIds = []
  const newPanels = {...state.panels};
  Object.keys(newPanels).forEach(roofIndex => {
    Object.keys(newPanels[roofIndex]).forEach(panelId => {
      const newPV = PV.copyPolygon(newPanels[roofIndex][panelId].pv);
      newPV.releaseConnected();
      newPanels[roofIndex][panelId].pv = newPV;

      disconnectedPanelIds.push(panelId);
    })
  })
  return {
    ...state,
    panels: newPanels,
    connectedPanelId: [],
    disconnectedPanelId: disconnectedPanelIds
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
    case actionTypes.SET_PV_CONNECTED:
      return setPVConnected(state, action);
    case actionTypes.SET_PV_DISCONNECTED:
      return setPVDisConnected(state, action);
    case actionTypes.SET_ROOF_ALL_PV_DISCONNECTED:
      return setRoofAllPVDisConnected(state, action);
    default: return state;
  }
};

export default reducer;
