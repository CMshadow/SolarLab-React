import * as actionTypes from './actionTypes';

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
