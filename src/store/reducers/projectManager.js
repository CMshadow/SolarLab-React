import * as Cesium from 'cesium';

import * as actionTypes from '../actions/actionTypes';
import ProjectInfo from '../../infrastructure/projectInfo/projectInfo';

const initialState = {
  projectId: null,
  projectInfo: new ProjectInfo(),
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    default: return state;
  }
};

export default reducer;
