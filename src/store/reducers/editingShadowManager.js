import * as actionTypes from '../actions/actionTypes';

/*
  shadows: {
    [shadowPolygon.entityId]: {
      from: keepout.entityId / roofPolygon.entityId,
      to: roofPolygon.entityid,
      polygon: shadowPolygon
    }
  }
 */
const initialState = {
  shadows: {},
  specialParapetShadows: {},
}

const projectAllShadow = (state, action) => {
  return {
    ...state,
    shadows: action.shadows,
    specialParapetShadows: action.specialParapetShadows
  };
}

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.PROJECT_ALL_SHADOW:
      return projectAllShadow(state, action);
    default:
      return state;
  }
};

export default reducer;
