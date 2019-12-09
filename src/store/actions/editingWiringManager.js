import * as actionTypes from '../actions/actionTypes';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';
import Polyline from '../../infrastructure/line/polyline';
import Inverter from '../../infrastructure/inverter/inverter';
import Wiring from '../../infrastructure/inverter/wiring';
import Point from '../../infrastructure/point/point';
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
    const inverterName = getState().undoableReducer.present
      .editingWiringManager.userInverters.reduce((name, val) =>
        val.inverterID === result.inverterID ? val.inverterName : name
      , 0);
    const inverterSolutions = result.inverterSetUp.map((inverter, i) =>
      new Inverter(
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
  const coefficient = 0.75;
  const allPanels = getState().undoableReducer.present
    .editingPVPanelManagerReducer.panels[roofInd];
  const availablePanels = Object.keys(allPanels).flatMap(partial => {
    const partialRoofPanels = allPanels[partial].map(panelArray => {
      panelArray.filter(panel => !panel.pv.connected)
      console.log(panelArray[0])
      if (
        panelArray[0].rowPos === 'start' &&
        panelArray.slice(-1)[0].rowPos !== 'end'
      ) panelArray.reverse();
      return panelArray;
    })
    return partialRoofPanels.filter(panelArray => panelArray.length > 0);
  });
  const inverterConfig = getState().undoableReducer.present.editingWiringManager
    .roofSpecInverters[roofInd][inverterInd];

  console.log(availablePanels)
  const string = [availablePanels[0][0]];
  availablePanels[0][0].pv.setConnected();
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
  console.log(string)
  const panelsOnString = string.map(p => p.pv);
  const panelCenterPoints = string.map(p => {
    const center = Point.fromPoint(p.center);
    center.setCoordinate(null, null, center.height + 0.005);
    return center;
  });
  const wiringPolyline = new Polyline(panelCenterPoints);
  const newWiring = new Wiring(
    panelsOnString[0], panelsOnString.slice(-1)[0], panelsOnString, wiringPolyline
  )
  console.log(newWiring)
}
