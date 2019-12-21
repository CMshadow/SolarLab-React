import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';
import Polyline from '../../infrastructure/line/polyline';
import Inverter from '../../infrastructure/inverter/inverter';
import Wiring from '../../infrastructure/inverter/wiring';
import Point from '../../infrastructure/point/point';
import PV from '../../infrastructure/Polygon/PV';
import { setBackendLoadingTrue, setBackendLoadingFalse} from './projectManager';
import { setUIStateSetUpWiring } from './uiStateManager';

export const fetchUserInverters = () => (dispatch, getState) => {
  const userID = getState().authReducer.userID;
  dispatch(setBackendLoadingTrue());
  axios.get(`/${userID}/inverter`, {
    params: {
      attributes: JSON.stringify(['inverterName', 'inverterID'])
    }
  })
  .then(response => {
    dispatch({
      type: actionTypes.FETCH_USER_INVERTERS,
      inverterData: response.data.data
    })
    dispatch(setUIStateSetUpWiring());
    return dispatch(setBackendLoadingFalse());
  })
  .catch(error => {
    dispatch(setBackendLoadingFalse());
    return errorNotification(
      'Backend Error',
      error.response.data.errorMessage
    )
  })
}

export const calculateAutoInverter = (roofIndex) => (dispatch, getState) => {
  const allPanels =
    getState().undoableReducer.present.editingPVPanelManagerReducer.panels;
  const roofSpecParams =
    getState().undoableReducer.present.editingPVPanelManagerReducer
    .roofSpecParams;
  const totalPanels =
    Object.keys(allPanels).reduce((acc, k) => {
    const totalPanelsOnRoof = allPanels[k].reduce((acc2, partial) => {
      const totalPanelOnPartial = partial.reduce((acc3, array) => {
        return acc3 + array.length;
      }, 0);
      return acc2 + totalPanelOnPartial;
    }, 0);
    return acc + totalPanelsOnRoof;
  }, 0);
  dispatch(setBackendLoadingTrue());
  axios.get('/calculate-inverter-solution/auto', {
    params: {
      totalPanels: totalPanels,
      userID: getState().authReducer.userID,
      panelID: roofSpecParams[roofIndex].panelID,
      PVParams: JSON.stringify(roofSpecParams[roofIndex])
    }
  })
  .then(response => {
    const result = response.data.data;
    console.log(getState().undoableReducer.present
      .editingWiringManager.userInverters)
    const inverterName = getState().undoableReducer.present
      .editingWiringManager.userInverters.reduce((name, val) =>
        val.inverterID === result.inverterID ? val.inverterName : name
      , 0);
    const inverterSolutions = result.inverterSetUp.map((inverter, i) =>
      new Inverter(
        null,
        result.inverterID,
        `${0 + i + 1 >= 10 ? '' : 0}${0 + i + 1} - ${inverterName} `,
        0 + i + 1,
        inverter.panelPerString,
        inverter.stringPerInverter
      )
    )
    console.log(inverterSolutions)
    dispatch({
      type: actionTypes.SET_UP_INVERTER,
      roofIndex: roofIndex,
      inverterSolutions: inverterSolutions
    })
    return dispatch(setBackendLoadingFalse());
  })
  // .catch(error => {
  //   dispatch(setBackendLoadingFalse());
  //   return errorNotification(
  //     'Inverter Error',
  //     error.response.data.errorMessage
  //   )
  // })
}

export const calculateManualInverter = (roofIndex, inverterID) =>
(dispatch, getState) => {
  const allPanels =
    getState().undoableReducer.present.editingPVPanelManagerReducer.panels;
  const roofSpecParams =
    getState().undoableReducer.present.editingPVPanelManagerReducer
    .roofSpecParams;
  const totalPanels =
    Object.keys(allPanels).reduce((acc, k) => {
    const totalPanelsOnRoof = allPanels[k].reduce((acc2, partial) => {
      const totalPanelOnPartial = partial.reduce((acc3, array) => {
        return acc3 + array.length;
      }, 0);
      return acc2 + totalPanelOnPartial;
    }, 0);
    return acc + totalPanelsOnRoof;
  }, 0);
  dispatch(setBackendLoadingTrue());
  axios.get('/calculate-inverter-solution/manual', {
    params: {
      totalPanels: totalPanels,
      userID: getState().authReducer.userID,
      panelID: roofSpecParams[roofIndex].panelID,
      inverterID: inverterID,
      PVParams: JSON.stringify(roofSpecParams[roofIndex])
    }
  })
  .then(response => {
    const result = response.data.data;
    const inverterName = getState().undoableReducer.present
      .editingWiringManager.userInverters.reduce((name, val) =>
        val.inverterID === result.inverterID ? val.inverterName : name
      , 0);
    const inverterSolutions = result.inverterSetUp.map((inverter, i) =>
      new Inverter(
        null,
        result.inverterID,
        `${0 + i + 1 >= 10 ? '' : 0}${0 + i + 1} - ${inverterName} `,
        0 + i + 1,
        inverter.panelPerString,
        inverter.stringPerInverter
      )
    )
    console.log(inverterSolutions)
    dispatch({
      type: actionTypes.SET_UP_INVERTER,
      roofIndex: roofIndex,
      inverterSolutions: inverterSolutions
    })
    return dispatch(setBackendLoadingFalse());
  })
  .catch(error => {
    dispatch(setBackendLoadingFalse());
    return errorNotification(
      'Inverter Error',
      error.response.data.errorMessage
    )
  })
}

export const autoWiring = (roofInd, inverterInd, wiringInd) =>
(dispatch, getState) => {
  const allPanels = getState().undoableReducer.present
    .editingPVPanelManagerReducer.panels[roofInd];
  const availablePanels = allPanels.flatMap(partial => {
    const partialRoofPanels = partial.map(originPanelArray => {
      const panelArray = originPanelArray.filter(panel => !panel.pv.connected);
      if (panelArray.length === 0) return [];
      if (
        panelArray[0].rowPos === 'start' &&
        panelArray.slice(-1)[0].rowPos !== 'end'
      ) panelArray.reverse();
      return panelArray.map(panel => {
        return {
          ...panel,
          pv: PV.copyPolygon(panel.pv)
        }
      });
    })
    return partialRoofPanels.filter(panelArray => panelArray.length > 0);
  });
  const inverterConfig = getState().undoableReducer.present.editingWiringManager
    .roofSpecInverters[roofInd][inverterInd];

  const string = findAWiringString(availablePanels, inverterConfig, 0);

  const panelsOnString = string.map(p => p.pv);
  const panelCenterPoints = string.map(p => {
    const center = Point.fromPoint(p.center);
    center.setCoordinate(null, null, center.height + 0.1);
    return center;
  });
  const wiringPolyline = new Polyline(
    panelCenterPoints, null, 'wiring', Cesium.Color.DARKORANGE
  );
  const newWiring = new Wiring(
    null, panelsOnString[0], panelsOnString.slice(-1)[0], panelsOnString,
    wiringPolyline
  );
  dispatch({
    type: actionTypes.AUTO_WIRING,
    wiring: newWiring,
    roofIndex: roofInd,
    inverterIndex: inverterInd,
    wiringIndex: wiringInd
  });
}

export const editWiring = (roofInd, inverterInd, wiringInd) =>
(dispatch, getState) => {
  return dispatch({
    type: actionTypes.EDIT_WIRING,
    roofIndex: roofInd,
    inverterIndex: inverterInd,
    wiringIndex: wiringInd
  })
}

const findAWiringString = (availablePanels, inverterConfig, startIndex) => {
  const coefficient = 0.75;

  const string = [availablePanels[startIndex][0]];
  availablePanels[startIndex][0].pv.setConnected();
  for (let i = 0; i < inverterConfig.panelPerString - 1; i++) {
    const currentPanel = string.slice(-1)[0];
    const withDist = availablePanels.map((panelArray, panelArrayInd) => {
      let dist = null;
      if (
        (currentPanel.rowPos === 'start' ||
        currentPanel.rowPos === 'end' ||
        currentPanel.rowPos === 'single') &&
        (panelArray[0].rowPos === 'start' ||
        panelArray[0].rowPos === 'end' ||
        panelArray[0].rowPos === 'single')
      ) {
        dist = Point.surfaceDistance(currentPanel.center, panelArray[0].center)
          * coefficient;
      } else {
        dist = Point.surfaceDistance(currentPanel.center, panelArray[0].center)
      }

      return {
        dist: dist,
        panelArrayInd: panelArrayInd,
        pvInfo: panelArray[0]
      };
    }).filter(elem => !elem.pvInfo.pv.connected);
    withDist.sort((first, second) => first.dist > second.dist ? 1 : -1);
    const nextPanel = withDist[0].pvInfo;
    string.push(nextPanel);
    availablePanels[withDist[0].panelArrayInd][0].pv.setConnected();
  }
  return string;
}

export const setHoverWiringPoint = (position) => {
  return {
    type: actionTypes.SET_HOVER_WIRING_POINT,
    position: position
  };
}

export const releaseHoverWiringPoint = () => {
  return {
    type: actionTypes.RELEASE_HOVER_WIRING_POINT,
  };
}

export const setPickedWiringPoint = () => {
  return {
    type: actionTypes.SET_PICKED_WIRING_POINT,
  };
}

export const releasePickedWiringPoint = () => {
  return {
    type: actionTypes.RELEASE_PICKED_WIRING_POINT,
  };
}

export const releasePVPanel = () => {
  return {
    type: actionTypes.RELEASE_PV_PANEL
  }
}

export const attachPVPanel = () => {
  return {
    type: actionTypes.ATTACH_PV_PANEL
  }
}

export const dynamicWiringLine = () => (dispatch, getState) => {
  const mouseCartesian3 = getState().undoableReducer.present
    .drawingManagerReducer.mouseCartesian3;
  if (Cesium.defined(mouseCartesian3)) {
    return {
      type: actionTypes.DYNAMIC_WIRING_LINE,
      cartesian3: mouseCartesian3
    };
  } else {
    return {
      type: actionTypes.DO_NOTHING
    };
  }
}
