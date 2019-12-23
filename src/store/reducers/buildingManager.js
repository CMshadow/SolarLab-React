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
  } else if (state.workingBuilding instanceof PitchedBuilding) {
    newWorkingBuilding = PitchedBuilding.fromBuilding(state.workingBuilding);
    newWorkingBuilding.bindPitchedPolygon(action.pitchedPolygons);
    newWorkingBuilding.bindPitchedPolygonExcludeStb(
      action.pitchedPolygonsExcludeStb
    );
  }

  return {
    ...state,
    workingBuilding: newWorkingBuilding
  };
}

const bindShadow = (state, action) => {
  let newWorkingBuilding = null;
  if (state.workingBuilding instanceof FlatBuilding) {
    newWorkingBuilding = FlatBuilding.fromBuilding(state.workingBuilding);
    newWorkingBuilding.bindShadow(action.shadow);
  } else if (state.workingBuilding instanceof PitchedBuilding) {
    newWorkingBuilding = PitchedBuilding.fromBuilding(state.workingBuilding);
    newWorkingBuilding.bindShadow(action.shadow);
  }

  return {
    ...state,
    workingBuilding: newWorkingBuilding
  };
}

const bindPVPanel = (state, action) => {
  let newWorkingBuilding = null;
  if (state.workingBuilding instanceof FlatBuilding) {
    newWorkingBuilding = FlatBuilding.fromBuilding(state.workingBuilding);
    newWorkingBuilding.bindPV(action.pv);
  } else if (state.workingBuilding instanceof PitchedBuilding) {
    newWorkingBuilding = PitchedBuilding.fromBuilding(state.workingBuilding);
    newWorkingBuilding.bindPV(action.pv);
  }

  return {
    ...state,
    workingBuilding: newWorkingBuilding
  };
}

const bindInverters = (state, action) => {
  let newWorkingBuilding = null;
  if (state.workingBuilding instanceof FlatBuilding) {
    newWorkingBuilding = FlatBuilding.fromBuilding(state.workingBuilding);
    newWorkingBuilding.bindInverters(action.inverters);
  } else if (state.workingBuilding instanceof PitchedBuilding) {
    newWorkingBuilding = PitchedBuilding.fromBuilding(state.workingBuilding);
    newWorkingBuilding.bindInverters(action.inverters);
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
    case actionTypes.BIND_SHADOW:
      return bindShadow(state, action);
    case actionTypes.BIND_PV:
      return bindPVPanel(state, action);
    case actionTypes.BIND_INVERTERS:
      return bindInverters(state, action);
    case actionTypes.UPDATE_BUILDING:
      return updateBuilding(state, action);
    default: return state;
  }
};

export default reducer;
