import * as actionTypes from '../actions/actionTypes';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';
import Inverter from '../../infrastructure/inverter/inverter';
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
        `${0 + i + 1 > 10 ? null : 0}${0 + i + 1} - ${inverterName} `,
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

export const calculateManualInverter = (roofIndex, inverterID) => (dispatch, getState) => {
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
        inverterName,
        0,
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
