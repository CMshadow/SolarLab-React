import * as actionTypes from '../actions/actionTypes';
import FlatBuilding from '../../infrastructure/building/flatBuilding';
import PitchedBuilding from '../../infrastructure/building/pitchedBuilding';

const initialState = {
  workingBuilding: null,
  buildingInfoFields: {
    name: null,
    type: 'FLAT',
    mode: '2D',
    foundHt: 5,
    parapetHt: 1,
    eaveStb: 1,
    hipStb: 1,
    ridgeStb: 1
  }
};

const initBuilding = (state, action) => {
  return {
    ...state,
    workingBuilding: action.buildingObj
  };
};

const updateBuilding = (state, action) => {
  let newWorkingBuilding = null;
  if (state.workingBuilding instanceof FlatBuilding) {
    newWorkingBuilding = FlatBuilding.fromBuilding(
      state.workingBuilding, null, null, action.foundationHeight,
      action.eaveSetback, action.parapetHeight
    );
  }
  return {
    ...state,
    workingBuilding: newWorkingBuilding
  }
};

const saveFields = (state, action) => {
  return {
    ...state,
    buildingInfoFields: {
      ...state.buildingInfoFields,
      ...action.values,
    }
  };
};

const bindFoundPolyline = (state, action) => {
  let newWorkingBuilding = null;
  if (state.workingBuilding instanceof FlatBuilding) {
    newWorkingBuilding = FlatBuilding.fromBuilding(state.workingBuilding);
    newWorkingBuilding.bindFoundPolyline(action.polyline);
  }

  return {
    ...state,
    workingBuilding: newWorkingBuilding
  };
};

const bindFoundPolygons = (state, action) => {
  let newWorkingBuilding = null;
  if (state.workingBuilding instanceof FlatBuilding) {
    newWorkingBuilding = FlatBuilding.fromBuilding(state.workingBuilding);
    newWorkingBuilding.bindFoundPolygon(action.polygon);
    newWorkingBuilding.bindFoundPolygonExcludeStb(action.polygonsExcludeStb);
    newWorkingBuilding.bindParapetPolygon(action.parapet);
  }

  return {
    ...state,
    workingBuilding: newWorkingBuilding
  };
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.SAVE_BUILDING_INFO_FIELDS:
      return saveFields(state, action);
    case actionTypes.BIND_FOUNDATION_POLYLINE:
      return bindFoundPolyline(state, action);
    case actionTypes.BIND_FOUNDATION_POLYGONS:
      return bindFoundPolygons(state, action);
    case actionTypes.INIT_BUILDING:
      return initBuilding(state, action);
    case actionTypes.UPDATE_BUILDING:
      return updateBuilding(state, action);
    default: return state;
  }
};

export default reducer;
