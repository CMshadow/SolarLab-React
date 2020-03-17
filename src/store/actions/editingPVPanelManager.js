import * as turf from '@turf/turf';

import * as actionTypes from '../actions/actionTypes';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';
import {makeUnionPolygonGeoJson} from '../../infrastructure/math/geoJSON';
import Point from '../../infrastructure/point/point';
import FoundLine from '../../infrastructure/line/foundLine';
import Polyline from '../../infrastructure/line/polyline';
import PV from '../../infrastructure/Polygon/PV';
import Polygon from '../../infrastructure/Polygon/Polygon';
import { setBackendLoadingTrue, setBackendLoadingFalse} from './projectManager';
import { setUIStateSetUpPV } from './uiStateManager';

const makeCombiGeometry = (props) => {
  const geoFoundation =
    props.workingRoof.map(polygon =>
      polygon.toFoundLine().makeGeoJSON()
    );
  const geoNormalKeepout = props.allNormalKeepout.map(kpt =>
    kpt.keepout.outlinePolygonPart2.toFoundLine().makeGeoJSON());
  const geoPassageKeepout = props.allPassageKeepout.map(kpt =>
    kpt.keepout.outlinePolygon.toFoundLine().makeGeoJSON());
  const geoVentKeepout = props.allVentKeepout.map(kpt =>
    kpt.keepout.outlinePolygon.toFoundLine().makeGeoJSON());
  const geoShadow = Object.keys(props.allShadow).map(k =>
    props.allShadow[k].polygon.toFoundLine().makeGeoJSON());
  const geoNormalKeepoutInOne = makeUnionPolygonGeoJson(geoNormalKeepout);
  const geoPassageKeepoutInOne = makeUnionPolygonGeoJson(geoPassageKeepout);
  const geoVentKeepoutInOne = makeUnionPolygonGeoJson(geoVentKeepout);
  const geoShadowInOne = makeUnionPolygonGeoJson(geoShadow);
  let keepoutCombi = null;
  let finalCombi = null;
  if (geoNormalKeepoutInOne.geometry.coordinates.length !== 0) {
    keepoutCombi = geoNormalKeepoutInOne
    if(geoPassageKeepoutInOne.geometry.coordinates.length !== 0) {
      keepoutCombi = turf.union(keepoutCombi, geoPassageKeepoutInOne);
    }
    if(geoVentKeepoutInOne.geometry.coordinates.length !== 0) {
      keepoutCombi = turf.union(keepoutCombi, geoVentKeepoutInOne);
    }
    if(geoShadowInOne.geometry.coordinates.length !== 0) {
      keepoutCombi = turf.union(keepoutCombi, geoShadowInOne);
    }
    finalCombi = geoFoundation.map(geo => {
      const diff = turf.difference(geo, keepoutCombi);
      if (typeof(diff.geometry.coordinates[0][0][0]) === 'number') {
        diff.geometry.coordinates = [diff.geometry.coordinates];
        return diff;
      } else {
        return diff;
      }
    });
  }
  else if (geoPassageKeepoutInOne.geometry.coordinates.length !== 0) {
    keepoutCombi = geoPassageKeepoutInOne;
    if(geoVentKeepoutInOne.geometry.coordinates.length !== 0) {
      keepoutCombi = turf.union(keepoutCombi, geoVentKeepoutInOne);
    }
    if(geoShadowInOne.geometry.coordinates.length !== 0) {
      keepoutCombi = turf.union(keepoutCombi, geoShadowInOne);
    }
    finalCombi = geoFoundation.map(geo => {
      const diff = turf.difference(geo, keepoutCombi);
      if (typeof(diff.geometry.coordinates[0][0][0]) === 'number') {
        diff.geometry.coordinates = [diff.geometry.coordinates];
        return diff;
      } else {
        return diff;
      }
    });
  }
  else if (geoVentKeepoutInOne.geometry.coordinates.length !== 0) {
    keepoutCombi = geoVentKeepoutInOne;
    if(geoShadowInOne.geometry.coordinates.length !== 0) {
      keepoutCombi = turf.union(keepoutCombi, geoShadowInOne);
    }
    finalCombi = geoFoundation.map(geo => {
      const diff = turf.difference(geo, keepoutCombi);
      if (typeof(diff.geometry.coordinates[0][0][0]) === 'number') {
        diff.geometry.coordinates = [diff.geometry.coordinates];
        return diff;
      } else {
        return diff;
      }
    });
  }
  else if (geoShadowInOne.geometry.coordinates.length !== 0) {
    keepoutCombi = geoShadowInOne;
    finalCombi = geoFoundation.map(geo => {
      const diff = turf.difference(geo, keepoutCombi);
      if (typeof(diff.geometry.coordinates[0][0][0]) === 'number') {
        diff.geometry.coordinates = [diff.geometry.coordinates];
        return diff;
      } else {
        return diff;
      }
    });
  }
  else {
    finalCombi = geoFoundation
    finalCombi.forEach(geo =>
      geo.geometry.coordinates = [[...geo.geometry.coordinates]]
    );
  }
  return finalCombi;
}

const makeRequestData = (props) => {
  const finalCombi = makeCombiGeometry(props);
  const requestData = []
  finalCombi.forEach(roof => {
    roof.geometry.coordinates.forEach(partialRoof => {
      const startAndLastPoint = new Point(
        partialRoof[0][0][0], partialRoof[0][0][1],
        0
      );
      const roofFoundLine = new FoundLine([
        startAndLastPoint,
        ...(partialRoof[0].slice(1,-1).map(cor => new Point(
          cor[0], cor[1], 0
        ))),
        startAndLastPoint
      ]);
      const allKeepoutFoundLine = partialRoof.slice(1).map(kpt => {
        const startAndLastPoint = new Point(
          kpt[0][0], kpt[0][1], 0
        );
        return new FoundLine([
          startAndLastPoint,
          ...(kpt.slice(1,-1).map(cor => new Point(
            cor[0], cor[1], 0
          ))),
          startAndLastPoint
        ]);
      })
      requestData.push([roofFoundLine, allKeepoutFoundLine]);
    })
  })
  return requestData;
}

export const fetchUserPanels = () => (dispatch, getState) => {
  const userID = getState().undoable.present.authManager.userID;
  dispatch(setBackendLoadingTrue());
  axios.get(`/${userID}/panel`)
  .then(response => {
    dispatch({
      type: actionTypes.FETCH_USER_PANELS,
      panelData: response.data.data
    })
    dispatch(setUIStateSetUpPV());
    return dispatch(setBackendLoadingFalse());
  })
  .catch(error => {
    dispatch(setBackendLoadingFalse());
    return errorNotification(
      'Backend Error',
      error.response.data.errorMessage || error
    )
  })
}

export const generatePanels = (roofIndex) => (dispatch, getState) => {
  const workingBuilding = getState().undoable.present.buildingManager
    .workingBuilding;
  const props = {
    workingRoof:
      workingBuilding.type === 'FLAT' ?
      workingBuilding.foundationPolygonExcludeStb :
      workingBuilding.pitchedRoofPolygonsExcludeStb[roofIndex],
    allNormalKeepout: getState().undoable.present.keepoutManager.normalKeepout,
    allPassageKeepout: getState().undoable.present.keepoutManager.passageKeepout,
    allVentKeepout: getState().undoable.present.keepoutManager.ventKeepout,
    allShadow: workingBuilding.shadow
  }
  console.log(props)
  const data = makeRequestData(props);
  const params = getState().undoable.present.editingPVPanelManager
    .roofSpecParams[roofIndex];
  const selectPanelIndex = params.selectPanelIndex;
  const panelX = +getState().undoable.present.editingPVPanelManager
    .userPanels[selectPanelIndex].panelWidth;
  const panelY = +getState().undoable.present.editingPVPanelManager
    .userPanels[selectPanelIndex].panelLength;
  const panelWidth = panelX > panelY ? panelX : panelY;
  const panelLength = panelX < panelY ? panelX : panelY;

  const requestData = {
    data: data,
    azimuth: params.azimuth,
    tilt: params.tilt,
    panelWidth: params.orientation === 'portrait' ? panelWidth : panelLength,
    panelLength: params.orientation === 'portrait' ? panelLength : panelWidth,
    rowSpace: params.rowSpace,
    colSpace: params.colSpace,
    align: params.align,
    height: workingBuilding.foundationHeight,
    initArraySequenceNum: 1,
    rowPerArray: 1,
    panelsPerRow: 1
  };
  if (params.mode === 'array') {
    requestData.rowPerArray = params.rowPerArray;
    requestData.panelsPerRow = params.panelPerRow;
  }

  if (workingBuilding.type === 'FLAT') {
    console.log(requestData)
    generateFlatRoofPanels(dispatch, requestData);
  } else {
    requestData.pitchedRoofPolygon =
      workingBuilding.pitchedRoofPolygons[roofIndex];
    requestData.height =
      workingBuilding.pitchedRoofPolygons[roofIndex].lowestNode[2];
    console.log(requestData)
    generatePitchedRoofPanels(dispatch, requestData, roofIndex);
  }
}

const generateFlatRoofPanels = (dispatch, requestData) => {
  dispatch(cleanPanels(0));
  dispatch(setBackendLoadingTrue());
  axios.post('/calculate-roof-pv-panels/flatroof', requestData)
  .then(response => {
    dispatch({
      type: actionTypes.INIT_EDITING_PANELS,
      roofIndex: 0,
      panels: JSON.parse(response.data.body).panelLayout.map(partialRoof =>
        partialRoof.map(array =>
          array.map(panel => {
            const pvPolyline = Polyline.fromPolyline(panel.pvPolyline)
            const brng = Point.bearing(
              pvPolyline.points[0], pvPolyline.points[2]
            );
            const dist = Point.surfaceDistance(
              pvPolyline.points[0], pvPolyline.points[2]
            );
            const center = Point.destination(
              pvPolyline.points[0], brng, dist / 2);
            center.setCoordinate(
              null, null, pvPolyline.points[0].height +
              (pvPolyline.points[2].height - pvPolyline.points[0].height) / 2
            )
            return {
              ...panel,
              center: center,
              pv: new PV(
                null, null, Polygon.makeHierarchyFromPolyline(pvPolyline)
              )
            };
          })
        )
      )
    });
    return dispatch(setBackendLoadingFalse());
  })
  .catch(error => {
    console.log(error)
    dispatch(setBackendLoadingFalse());
    return errorNotification(
      'Backend Error',
      error.toString()
    )
  });
}

const generatePitchedRoofPanels = (dispatch, requestData, pitchedRoofIndex) => {
  dispatch(cleanPanels(pitchedRoofIndex));
  dispatch(setBackendLoadingTrue());
  axios.post('/calculate-roof-pv-panels/pitchedroof', requestData)
  .then(response => {
    console.log(JSON.parse(response.data.body).panelLayout)
    dispatch({
      type: actionTypes.INIT_EDITING_PANELS,
      roofIndex: pitchedRoofIndex,
      panels: JSON.parse(response.data.body).panelLayout.map(partialRoof =>
        partialRoof.map(array =>
          array.map(panel => {
            const pvPolyline = Polyline.fromPolyline(panel.pvPolyline)
            const brng = Point.bearing(
              pvPolyline.points[0], pvPolyline.points[2]
            );
            const dist = Point.surfaceDistance(
              pvPolyline.points[0], pvPolyline.points[2]
            );
            const center = Point.destination(
              pvPolyline.points[0], brng, dist);
            center.setCoordinate(
              null, null, pvPolyline.points[0].height +
              (pvPolyline.points[2].height - pvPolyline.points[0].height) / 2
            )
            return {
              ...panel,
              center: center,
              pv: new PV(
                null, null, Polygon.makeHierarchyFromPolyline(pvPolyline)
              )
            };
          })
        )
      )
    });
    return dispatch(setBackendLoadingFalse());
  })
  .catch(error => {
    dispatch(setBackendLoadingFalse());
    return errorNotification(
      'Backend Error',
      error.toString()
    )
  });
}

export const setupPanelParams = (values, roofIndex) => {
  return {
    type: actionTypes.SETUP_PANEL_PARAMS,
    parameters: values,
    roofIndex: roofIndex
  };
}

export const cleanPanels = (roofIndex) => {
  return {
    type: actionTypes.CLEAN_EDITING_PANELS,
    roofIndex: roofIndex
  };
}

export const setPVConnected = (panelId) => {
  return {
    type: actionTypes.SET_PV_CONNECTED,
    panelId: panelId,
  };
}

export const setPVDisConnected = (panelId) => {
  return {
    type: actionTypes.SET_PV_DISCONNECTED,
    panelId: panelId,
  };
}

export const setRoofAllPVDisConnected = () => {
  return {
    type: actionTypes.SET_ROOF_ALL_PV_DISCONNECTED,
  };
}
