import * as actionTypes from './actionTypes';
import FoundLine from '../../infrastructure/line/foundLine';
import Polygon from '../../infrastructure/Polygon/Polygon';
import Wall from '../../infrastructure/Polygon/wall';
import Sphere from '../../infrastructure/Polygon/sphere';
import FlatBuilding from '../../infrastructure/building/flatBuilding';
import PitchedBuilding from '../../infrastructure/building/pitchedBuilding';
import Shadow from '../../infrastructure/Polygon/shadow';

/**
 * Create a new Flat/Pitched Building Object depending on user inputs
 * @param  {Obj} values the Object of user inputs in createBuildingPanel where
 *                      keys are the field name and values are the user input
 *                      values.
 *                      i.e. {name:'building1', type:'Flat', eaveStb:0.5, ...}
 * @return {Redux dispatch}        forward the newly created Building Object to
 *                                 buildingManager reducer
 */
export const initBuilding = (values) => (dispatch, getState) => {
  /*
    Generate building serial
   */
  const buildingNum = getState().projectManagerReducer.projectInfo
    .buildingCollection.length;
  let buildingSerial = null;
  if (buildingNum < 9) {
    buildingSerial = `0${buildingNum + 1}`;
  } else {
    buildingSerial = `${buildingNum + 1}`;
  }

  /*
    Create new Flat/Pitched Building Object
   */
  let buildingObj = null;
  if (values.type === 'FLAT') {
    buildingObj = new FlatBuilding(
      values.name,
      buildingSerial,
      values.foundHt,
      values.eaveStb,
      values.parapetHt
    );
  } else {
    buildingObj = new PitchedBuilding(
      values.name,
      buildingSerial,
      values.foundHt,
      values.eaveStb,
      values.hipStb,
      values.ridgeStb,
    );
  }

  return dispatch({
    type: actionTypes.INIT_BUILDING,
    buildingObj: buildingObj,
  });
};

export const updateBuilding = (values) => {
  return {
    type: actionTypes.UPDATE_BUILDING,
    foundationHeight: values.foundationHeight,
    eaveSetback: values.eaveStb,
    parapetHeight: values.parapetHeight
  };
};

/**
 * The action saveing createBuildingPanel user inputs to redux for future
 * reference/change/retrieve
 * @param  {Obj} values the Object of user inputs in createBuildingPanel where
 *                      keys are the field name and values are the user input
 *                      values.
 *                      i.e. {name:'building1', type:'Flat', eaveStb:0.5, ...}
 * @return {Redux dispatch}        forward values to buildingManager reducer
 */
export const saveBuildingInfoFields = (values) => {
  return ({
    type: actionTypes.SAVE_BUILDING_INFO_FIELDS,
    values: values
  });
};

export const bindFoundPolyline = () => (dispatch, getState) => {
  const foundPolyline = FoundLine.fromPolyline(
    getState().undoableReducer.present.drawingManagerReducer.drawingPolyline
  );
  return dispatch({
    type: actionTypes.BIND_FOUNDATION_POLYLINE,
    polyline: foundPolyline
  });
};

export const bindFoundPolygons = () => (dispatch, getState) => {
  const buildingFoundation =
    getState().undoableReducer.present.drawingPolygonManagerReducer
    .BuildingFoundation.map(polygon => Polygon.copyPolygon(polygon));
  const buildingFoundationExcludeStb =
    getState().undoableReducer.present.drawingPolygonManagerReducer
    .BuildingFoundationExcludeStb.map(polygon => Polygon.copyPolygon(polygon));
  const buildingParapet = Wall.copyWall(
    getState().undoableReducer.present.drawingPolygonManagerReducer
    .BuildingParapet
  );
  return dispatch({
    type: actionTypes.BIND_FOUNDATION_POLYGONS,
    polygon: buildingFoundation,
    polygonsExcludeStb: buildingFoundationExcludeStb,
    parapet: buildingParapet
  });
};

export const bindPitchedPolygons = () => (dispatch, getState) => {
  const pitchedRoofPolygons =
    getState().undoableReducer.present.drawingRooftopManagerReducer
    .RooftopCollection.rooftopCollection.map(polygon =>
      Polygon.copyPolygon(polygon)
    );
  const pitchedRoofPolygonsExcludeStb =
    getState().undoableReducer.present.drawingRooftopManagerReducer
    .RooftopCollection.rooftopExcludeStb.map(array =>
      array.map(polygon =>
        Polygon.copyPolygon(polygon)
      )
    );
  return dispatch({
    type: actionTypes.BIND_FOUNDATION_POLYGONS,
    pitchedPolygons: pitchedRoofPolygons,
    pitchedPolygonsExcludeStb: pitchedRoofPolygonsExcludeStb
  });
}

export const bindShadow = () => (dispatch, getState) => {
  const shadows = getState().undoableReducer.present.editingShadowManager
    .shadows;
  const newShadows = {};
  Object.keys(shadows).forEach(key => {
    newShadows[key] = {
      ...shadows[key],
      polygon: Shadow.copyShadow(shadows[key].polygon)
    }
  });
  return dispatch({
    type: actionTypes.BIND_SHADOW,
    shadow: newShadows
  });
}

export const bindParapetShadow = () => (dispatch, getState) => {
  const parapetShadows = getState().undoableReducer.present.editingShadowManager
    .specialParapetShadows;
  console.log(parapetShadows)
  const newShadows = {};
  Object.keys(parapetShadows).forEach(key => {
    newShadows[key] = {
      ...parapetShadows[key],
      polygon: Shadow.copyShadow(parapetShadows[key].polygon)
    }
  });
  return dispatch({
    type: actionTypes.BIND_PARAPET_SHADOW,
    parapetShadow: newShadows
  });
}

export const bindPVPanels = () => (dispatch, getState) => {
  const pv = getState().undoableReducer.present.editingPVPanelManagerReducer
    .panels;
  const pvRoofSpecParams = getState().undoableReducer.present.editingPVPanelManagerReducer
    .roofSpecParams
  const newPV = {};
  Object.keys(pv).forEach(key => {
    newPV[key] = [
      ...pv[key]
    ]
  });
  return dispatch({
    type: actionTypes.BIND_PV,
    pv: newPV,
    roofSpecParams: pvRoofSpecParams
  });
}

export const bindInverters = () => (dispatch, getState) => {
  const inverters = getState().undoableReducer.present.editingWiringManager
    .roofSpecInverters;
  const newInverters = {};
  Object.keys(inverters).forEach(key => {
    newInverters[key] = [
      ...inverters[key]
    ]
  });
  return dispatch({
    type: actionTypes.BIND_INVERTERS,
    inverters: newInverters
  });
}

/**
 * Reset buildingManager to its initial state
 * @return {Redux action}        tell buildingManager reducer to reset to init
 *                               state
 */
export const resetBuilding = () => {
  return ({
    type: actionTypes.RESET_BUILDING
  });
};
