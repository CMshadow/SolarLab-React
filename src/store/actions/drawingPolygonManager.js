import * as actionTypes from './actionTypes';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';
import Polygon from '../../infrastructure/Polygon/Polygon';

export const createPolygonFoundation = () => (dispatch, getState) => {
  const buildingCoordinatesArray =
    Polygon.makeHierarchyFromPolyline(
      getState().undoableReducer.present.drawingManagerReducer.drawingPolyline,
      getState().buildingManagerReducer.workingBuilding.foundationHeight
    );
  return dispatch({
    type: actionTypes.CREATE_POLYGON_FOUNDATION,
    height: getState().buildingManagerReducer.workingBuilding.foundationHeight,
    coordinatesArray: buildingCoordinatesArray
  })
};

export const createPolygonFoundationExcludeStb = () => (dispatch, getState) => {
  const foundPolyline =
    getState().undoableReducer.present.drawingManagerReducer.drawingPolyline;
  const foundHeight =
    getState().buildingManagerReducer.workingBuilding.foundationHeight;
  const stbDist =
    getState().buildingManagerReducer.workingBuilding.eaveSetback;
  console.log('axiosing')
  axios.get('/calculate-setback-coordinate', {
    params: {
      originPolyline: foundPolyline,
      stbDist: stbDist,
      direction: 'inside'
    }
  })
  .then(response => {
    console.log(response)
    dispatch({
      type: actionTypes.CREATE_POLYGON_FOUNDATION_EXCLUDE_SETBACK,
      height: foundHeight,
      // coordinatesArray: coordinatesArray
    })
  })
  .catch(error => {
    return errorNotification(
      'Backend Error',
      error
    )
  });
};


export const setUpPolygonFoundation = () => {
  return ({
    type: actionTypes.SET_POLYGON_FOUNDATION
  });
};
