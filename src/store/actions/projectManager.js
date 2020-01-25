import * as actionTypes from './actionTypes';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';

export const calculateOrFetchGlobalOptimal = () => (dispatch, getState) => {
  axios.get('/optimal-calculation/fetch-global-optimal', {
    params: {
      longitude:
        getState().undoable.present.projectManager.projectInfo.projectLon,
      latitude:
        getState().undoable.present.projectManager.projectInfo.projectLat
    }
  }).then(response => {
    console.log(response)
      dispatch({
        type: actionTypes.SET_GLOBAL_OPTIMAL,
        globalOptimalAzimuth: response.data.optimalAzimuth,
        globalOptimalTilt: response.data.optimalTilt
      });
  }).catch(err => {
    return errorNotification(
      'Backend Error',
      err.response.data.errorMessage
    )
  })
}

export const setBackendLoadingTrue = () => {
  return {
    type: actionTypes.SET_BACKENDLOADING_TRUE
  };
}

export const setBackendLoadingFalse = () => {
  return {
    type: actionTypes.SET_BACKENDLOADING_FALSE
  };
}
