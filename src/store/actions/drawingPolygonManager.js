import * as actionTypes from './actionTypes';
import * as actions from './index';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';
import Polygon from '../../infrastructure/Polygon/Polygon';
import Wall from '../../infrastructure/Polygon/wall';
import FoundLine from '../../infrastructure/line/foundLine';
import { setBackendLoadingTrue, setBackendLoadingFalse} from './projectManager';

export const createPolygonFoundationWrapper = () => (dispatch, getState) => {
  const foundPolyline =
    getState().undoable.present.drawingManager.drawingPolyline;
  const foundHeight =
    getState().undoable.present.buildingManager.workingBuilding
    .foundationHeight;
  const stbDist =
    getState().undoable.present.buildingManager.workingBuilding.eaveSetback;

  dispatch(setBackendLoadingTrue());
  axios.post('/calculate-setback-coordinate', {
    originPolylines: [foundPolyline],
    stbDists: [stbDist],
    direction: 'inside'
  })
  .then(response => {
    console.log(response)
    dispatch(createWall());
    if (stbDist !== 0){
      dispatch(createPolygonFoundationIncludeStb());
    }
    const stbPolylines = JSON.parse(response.data.body).stbPolylines[0];
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
  .then(() => {
    dispatch(actions.createAllKeepoutPolygon());
  }).then(() => {
    dispatch(setBackendLoadingFalse());
    dispatch(actions.setUIStateEditing3D());
  })
  .catch(error => {
    dispatch(setBackendLoadingFalse());
    return errorNotification(
      'Backend Error',
      error.toString()
    )
  });
};

export const createPolygonFoundationIncludeStb = () => (dispatch, getState) => {
  const foundationHierarchy =
    Polygon.makeHierarchyFromPolyline(
      getState().undoable.present.drawingManager.drawingPolyline,
      getState().undoable.present.buildingManager.workingBuilding
      .foundationHeight,
      -0.005
    );
  return dispatch({
    type: actionTypes.CREATE_POLYGON_FOUNDATION,
    height: getState().undoable.present.buildingManager.workingBuilding
      .foundationHeight,
    coordinatesArray: foundationHierarchy
  })
};

export const createWall = () => (dispatch, getState) =>{
  const foundHeight =
    getState().undoable.present.buildingManager.workingBuilding
    .foundationHeight;
  const parapetHeight =
    getState().undoable.present.buildingManager.workingBuilding.parapetHeight;
  const positions = Wall.makePositionsFromPolyline(
      getState().undoable.present.drawingManager.drawingPolyline,
    );
  dispatch({
    type: actionTypes.CREATE_WALL,
    minimumHeight: foundHeight,
    maximumHeight: foundHeight + parapetHeight,
    positions: positions
  })
}
