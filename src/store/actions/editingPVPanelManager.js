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

const makeCombiGeometry = (props) => {
  const geoFoundation =
    props.workingBuilding.foundationPolygonExcludeStb.map(polygon =>
      polygon.toFoundLine().makeGeoJSON()
    );
  const geoNormalKeepout = props.allNormalKeepout.map(kpt =>
    kpt.keepout.outlinePolygonPart2.toFoundLine().makeGeoJSON());
  const geoPassageKeepout = props.allPassageKeepout.map(kpt =>
    kpt.keepout.outlinePolygon.toFoundLine().makeGeoJSON());
  const geoVentKeepout = props.allVentKeepout.map(kpt =>
    kpt.keepout.outlinePolygon.toFoundLine().makeGeoJSON());
  const geoNormalKeepoutInOne = makeUnionPolygonGeoJson(geoNormalKeepout);
  const geoPassageKeepoutInOne = makeUnionPolygonGeoJson(geoPassageKeepout);
  const geoVentKeepoutInOne = makeUnionPolygonGeoJson(geoVentKeepout);
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
      // console.log(partialRoof)
      const startAndLastPoint = new Point(
        partialRoof[0][0][0], partialRoof[0][0][1],
        props.workingBuilding.foundationHeight
      );
      const roofFoundLine = new FoundLine([
        startAndLastPoint,
        ...(partialRoof[0].slice(1,-1).map(cor => new Point(
          cor[0], cor[1], props.workingBuilding.foundationHeight
        ))),
        startAndLastPoint
      ]);
      const allKeepoutFoundLine = partialRoof.slice(1).map(kpt => {
        const startAndLastPoint = new Point(
          kpt[0][0], kpt[0][1], props.workingBuilding.foundationHeight
        );
        return new FoundLine([
          startAndLastPoint,
          ...(kpt.slice(1,-1).map(cor => new Point(
            cor[0], cor[1], props.workingBuilding.foundationHeight
          ))),
          startAndLastPoint
        ]);
      })
      requestData.push([roofFoundLine, allKeepoutFoundLine]);
    })
  })
  return requestData;
}


export const generatePanels = () => (dispatch, getState) => {
  const props = {
    workingBuilding: getState().buildingManagerReducer.workingBuilding,
    allNormalKeepout: getState().keepoutManagerReducer.normalKeepout,
    allPassageKeepout: getState().keepoutManagerReducer.passageKeepout,
    allVentKeepout: getState().keepoutManagerReducer.ventKeepout
  }
  const data = makeRequestData(props);
  const params = getState().undoableReducer.present.editingPVPanelManagerReducer
    .parameters

  let requestData = null;
  if (params.mode === 'individual') {
    requestData = {
      data: data,
      azimuth: params.azimuth,
      tilt: params.tilt,
      panelWidth: params.orientation === 'portrait' ? 2 : 1,
      panelLength: params.orientation === 'portrait' ? 1 : 2,
      rowSpace: params.rowSpace,
      colSpace: params.colSpace,
      align: params.align,
      height: props.workingBuilding.foundationHeight,
      initArraySequenceNum: 1,
      rowPerArray: 1,
      panelsPerRow: 1
    }
    console.log(requestData)
  } else {
    requestData = {
      data: data,
      azimuth: params.azimuth,
      tilt: params.tilt,
      panelWidth: params.orientation === 'portrait' ? 2 : 1,
      panelLength: params.orientation === 'portrait' ? 1 : 2,
      rowSpace: params.rowSpace,
      colSpace: params.colSpace,
      align: params.align,
      height: props.workingBuilding.foundationHeight,
      initArraySequenceNum: 1,
      rowPerArray: params.rowPerArray,
      panelsPerRow: params.panelPerRow
    }
    console.log(requestData)
  }
  generateFlatRoofIndividualPanels(dispatch, requestData);
}

const generateFlatRoofIndividualPanels = (dispatch, requestData) => {
  dispatch(cleanPanels());
  dispatch(setBackendLoadingTrue());
  axios.post('/calculate-roof-pv-panels/flatroof-individual', requestData)
  .then(response => {
    console.log(JSON.parse(response.data.body).panelLayout)
    dispatch({
      type: actionTypes.INIT_EDITING_PANELS,
      panels: JSON.parse(response.data.body).panelLayout.map(partialRoof =>
        partialRoof.map(array =>
          array.map(panel => ({
            ...panel,
            pv: new PV(null, null, Polygon.makeHierarchyFromPolyline(
              Polyline.fromPolyline(panel.pvPolyline)
            ))
          }))
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

export const setupPanelParams = (values) => {
  return {
    type: actionTypes.SETUP_PANEL_PARAMS,
    parameters: values
  };
}

export const cleanPanels = () => {
  return {
    type: actionTypes.CLEAN_EDITING_PANELS
  };
}
