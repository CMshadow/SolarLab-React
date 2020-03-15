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
  const wiringPanelIds = action.wiring.allPanels.map(pv => pv.entityId);
  const newPanels = {...state.panels};
  const changes = newPanels[action.roofIndex].map(partial =>
    partial.map(panelArray =>
      panelArray.map(panel => {
        if (wiringPanelIds.includes(panel.pv.entityId)) {
          const newPV = PV.copyPolygon(panel.pv);
          newPV.setConnected();
          newPV.setColor(Cesium.Color.ROYALBLUE.withAlpha(0.75));
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
  const disconnectedPanelIds = Object.keys(newPanels).flatMap(roofIndex =>
    newPanels[roofIndex].flatMap(partial => {
      const partialRoofPanels = partial.flatMap(originPanelArray => {
        const panelArray = originPanelArray.filter(panel => !panel.pv.connected);
        if (panelArray.length === 0) return [];
        return panelArray.map(panel => panel.pv.entityId);
      })
      return partialRoofPanels.filter(panelArray => panelArray.length > 0);
    })
  )
  const connectedPanelIds = Object.keys(newPanels).flatMap(roofIndex =>
    newPanels[roofIndex].flatMap(partial => {
      const partialRoofPanels = partial.flatMap(originPanelArray => {
        const panelArray = originPanelArray.filter(panel => panel.pv.connected);
        if (panelArray.length === 0) return [];
        return panelArray.map(panel => panel.pv.entityId);
      })
      return partialRoofPanels.filter(panelArray => panelArray.length > 0);
    })
  )
  return {
    ...state,
    panels: newPanels,
    connectedPanelId: connectedPanelIds,
    disconnectedPanelId: disconnectedPanelIds
  };
}

const setPVConnected = (state, action) => {
  const newPanels = {...state.panels};
  const changes = newPanels[action.roofIndex].map(partial =>
    partial.map(panelArray =>
      panelArray.map(panel => {
        if (panel.pv.entityId === action.panelId) {
          const newPV = PV.copyPolygon(panel.pv);
          newPV.setConnected();
          newPV.setColor(Cesium.Color.ROYALBLUE.withAlpha(0.75));
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
  const disconnectedPanelIds = Object.keys(newPanels).flatMap(roofIndex =>
    newPanels[roofIndex].flatMap(partial => {
      const partialRoofPanels = partial.flatMap(originPanelArray => {
        const panelArray = originPanelArray.filter(panel => !panel.pv.connected);
        if (panelArray.length === 0) return [];
        return panelArray.map(panel => panel.pv.entityId);
      })
      return partialRoofPanels.filter(panelArray => panelArray.length > 0);
    })
  )
  const connectedPanelIds = Object.keys(newPanels).flatMap(roofIndex =>
    newPanels[roofIndex].flatMap(partial => {
      const partialRoofPanels = partial.flatMap(originPanelArray => {
        const panelArray = originPanelArray.filter(panel => panel.pv.connected);
        if (panelArray.length === 0) return [];
        return panelArray.map(panel => panel.pv.entityId);
      })
      return partialRoofPanels.filter(panelArray => panelArray.length > 0);
    })
  )
  return {
    ...state,
    panels: newPanels,
    connectedPanelId: connectedPanelIds,
    disconnectedPanelId: disconnectedPanelIds
  };
}

const setPVDisConnected = (state, action) => {
  const newPanels = {...state.panels};
  const changes = newPanels[action.roofIndex].map(partial =>
    partial.map(panelArray =>
      panelArray.map(panel => {
        if (panel.pv.entityId === action.panelId) {
          const newPV = PV.copyPolygon(panel.pv);
          newPV.releaseConnected();
          newPV.setColor(Cesium.Color.RED.withAlpha(0.5));
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
  const disconnectedPanelIds = Object.keys(newPanels).flatMap(roofIndex =>
    newPanels[roofIndex].flatMap(partial => {
      const partialRoofPanels = partial.flatMap(originPanelArray => {
        const panelArray = originPanelArray.filter(panel => !panel.pv.connected);
        if (panelArray.length === 0) return [];
        return panelArray.map(panel => panel.pv.entityId);
      })
      return partialRoofPanels.filter(panelArray => panelArray.length > 0);
    })
  )
  const connectedPanelIds = Object.keys(newPanels).flatMap(roofIndex =>
    newPanels[roofIndex].flatMap(partial => {
      const partialRoofPanels = partial.flatMap(originPanelArray => {
        const panelArray = originPanelArray.filter(panel => panel.pv.connected);
        if (panelArray.length === 0) return [];
        return panelArray.map(panel => panel.pv.entityId);
      })
      return partialRoofPanels.filter(panelArray => panelArray.length > 0);
    })
  )
  return {
    ...state,
    panels: newPanels,
    connectedPanelId: connectedPanelIds,
    disconnectedPanelId: disconnectedPanelIds
  };
}

const setRoofAllPVDisConnected = (state, action) => {
  const newPanels = {...state.panels};
  Object.keys(newPanels).forEach(roofIndex => {
    const changes = newPanels[roofIndex].map(partial =>
      partial.map(panelArray =>
        panelArray.map(panel => {
          const newPV = PV.copyPolygon(panel.pv);
          newPV.releaseConnected();
          return {
            ...panel,
            pv: newPV
          };
        })
      )
    );
    newPanels[roofIndex] = changes;
  })
  return {
    ...state,
    panels: newPanels,
    connectedPanelId: [],
    disconnectedPanelId: []
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
