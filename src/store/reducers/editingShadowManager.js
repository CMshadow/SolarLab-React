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
  shadows: {}
}

const projectAllShadow = (state, action) => {
  /*
    代码
   */
  return {
    ...state,
    shadows: null/*代码*/
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
