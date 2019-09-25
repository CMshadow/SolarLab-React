import * as actionTypes from './actionTypes';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';
import Polygon from '../../infrastructure/Polygon/Polygon';
import Wall from '../../infrastructure/Polygon/wall';
import FoundLine from '../../infrastructure/line/foundLine';

export const createPolygonFoundationWrapper = () => (dispatch, getState) => {
  const foundPolyline =
    getState().undoableReducer.present.drawingManagerReducer.drawingPolyline;
  const foundHeight =
    getState().buildingManagerReducer.workingBuilding.foundationHeight;
  const stbDist =
    getState().buildingManagerReducer.workingBuilding.eaveSetback;
  const parapetHt =
    getState().buildingManagerReducer.workingBuilding.parapetHeight;

  dispatch(setBackendLoadingTrue());
  axios.post('/calculate-setback-coordinate', {
    originPolyline: foundPolyline,
    stbDist: stbDist,
    direction: 'inside'
  })
  .then(response => {
    if (parapetHt !== 0){
      dispatch(createWall());
    }
    if (stbDist !== 0){
      dispatch(createPolygonFoundationIncludeStb());
    }
    const stbPolylines = JSON.parse(response.data.body).stbPolylines;
    const buildingCoordinatesArray = stbPolylines.map(stbPly => {
      return Polygon.makeHierarchyFromPolyline(
        FoundLine.fromPolyline(stbPly), foundHeight
      )
    });
    dispatch({
      type: actionTypes.CREATE_POLYGON_FOUNDATION_EXCLUDE_SETBACK,
      height: foundHeight,
      coordinatesArrays: buildingCoordinatesArray
    })
    dispatch(setBackendLoadingFalse());
  })
  .catch(error => {
    dispatch(setBackendLoadingFalse());
    return errorNotification(
      'Backend Error',
      error
    )
  });
};

export const createPolygonFoundationIncludeStb = () => (dispatch, getState) => {
  const foundationHierarchy =
    Polygon.makeHierarchyFromPolyline(
      getState().undoableReducer.present.drawingManagerReducer.drawingPolyline,
      getState().buildingManagerReducer.workingBuilding.foundationHeight,
      -0.01
    );
  return dispatch({
    type: actionTypes.CREATE_POLYGON_FOUNDATION,
    height: getState().buildingManagerReducer.workingBuilding.foundationHeight,
    coordinatesArray: foundationHierarchy
  })
};

export const createWall = () => (dispatch, getState) =>{
  const foundHeight =
    getState().buildingManagerReducer.workingBuilding.foundationHeight;
  const parapetHeight =
    getState().buildingManagerReducer.workingBuilding.parapetHeight;
  const positions = Wall.makePositionsFromPolyline(
      getState().undoableReducer.present.drawingManagerReducer.drawingPolyline,
    );
  dispatch({
    type: actionTypes.CREATE_WALL,
    minimumHeight: foundHeight,
    maximumHeight: foundHeight + parapetHeight,
    positions: positions
  })
}

export const setBackendLoadingTrue = () => {
  return ({
    type: actionTypes.SET_BACKENDLOADING_TRUE
  });
}

export const setBackendLoadingFalse = () => {
  return ({
    type: actionTypes.SET_BACKENDLOADING_FALSE
  });
}
