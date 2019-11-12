import * as actionTypes from './actionTypes';

export const setDebugPolylines = (polylines) => {
  return ({
    type: actionTypes.SET_DEBUGPOLYLINES,
    debugPolylines: polylines
  });
};

export const setDebugPoints = (points) => {
  return ({
    type: actionTypes.SET_DEBUGPOINTS,
    debugPoints: points
  });
};

export const setDebugPolygons = (polygons) => {
  return ({
    type: actionTypes.SET_DEBUGPOLYGONS,
    debugPolygons: polygons
  });
};
