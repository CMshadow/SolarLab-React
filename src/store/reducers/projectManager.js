import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import ProjectInfo from '../../infrastructure/projectInfo/projectInfo';

const initialState = {
  projectId: null,
  projectInfo: new ProjectInfo(),
  backendLoading: false
};

const setBackendLoadingTrue = (state, action) => {
  return {
    ...state,
    backendLoading: true
  };
}

const setBackendLoadingFalse = (state, action) => {
  return {
    ...state,
    backendLoading: false
  };
}


const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_BACKENDLOADING_TRUE:
      return setBackendLoadingTrue(state, action);
    case actionTypes.SET_BACKENDLOADING_FALSE:
      return setBackendLoadingFalse(state, action);
    default: return state;
  }
};

export default reducer;
