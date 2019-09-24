import * as actionTypes from './actionTypes';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';
import Polygon from '../../infrastructure/Polygon/Polygon';
import FoundLine from '../../infrastructure/line/foundLine';

export const createPolygonFoundation = () => (dispatch, getState) => {
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

export const createPolygonFoundationExcludeStb = () => (dispatch, getState) => {
  const foundPolyline =
    getState().undoableReducer.present.drawingManagerReducer.drawingPolyline;
  const foundHeight =
    getState().buildingManagerReducer.workingBuilding.foundationHeight;
  const stbDist =
    getState().buildingManagerReducer.workingBuilding.eaveSetback;
  axios.get('/calculate-setback-coordinate', {
    params: {
      originPolyline: foundPolyline,
      stbDist: stbDist,
      direction: 'inside'
    }
  })
  .then(response => {
    dispatch(createPolygonFoundation());
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
