import * as actionTypes from './actionTypes';

export const createPolygonFoundation = (newHeight, coordinatesArray) => {
    return ({
      type: actionTypes.CREATE_POLYGON_FOUNDATION,
      height: newHeight,
      coordinatesArray: coordinatesArray
    });
};

export const setUpPolygonFoundation = () => {
    return ({
      type: actionTypes.SET_POLYGON_FOUNDATION
    });
};

export const enableToBuildFoundation = () => {
  return ({
    type: actionTypes.ENABLE_TO_BUILD_FOUNDATION
  });
};
