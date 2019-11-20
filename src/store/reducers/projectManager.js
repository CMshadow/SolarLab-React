import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import ProjectInfo from '../../infrastructure/projectInfo/projectInfo';

const initialState = {
  projectId: null,
  projectInfo: new ProjectInfo(-117.841416, 33.646859, 500, 203, 28),
  backendLoading: false
};

const setGlobalOptimal = (state, action) => {
  const newProjectInfo = ProjectInfo.fromProjectInfo(state.projectInfo);
  newProjectInfo.setGlobalOptimal(
    action.globalOptimalAzimuth, action.globalOptimalTilt
  );
  return {
    ...state,
    projectInfo: newProjectInfo
  };
}

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
    case actionTypes.SET_GLOBAL_OPTIMAL:
      return setGlobalOptimal(state, action);
    case actionTypes.SET_BACKENDLOADING_TRUE:
      return setBackendLoadingTrue(state, action);
    case actionTypes.SET_BACKENDLOADING_FALSE:
      return setBackendLoadingFalse(state, action);
    default: return state;
  }
};

export default reducer;
