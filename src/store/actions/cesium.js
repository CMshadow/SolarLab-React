
import * as actionTypes from './actionTypes';

export const setViewer = (viewer) => {
  return {
    type: actionTypes.SET_VIEWER,
    viewer: viewer
  };
};

export const enableRotate = () => {
  return {
    type: actionTypes.ENABLE_ROTATION
  };
};

export const disableRotate = () => {
  return {
    type: actionTypes.DISABLE_ROTATION
  };
};

export const selectMap = (map) => {
  return {
    type: actionTypes.SELECT_MAP,
    selectedMap: map
  };
}
