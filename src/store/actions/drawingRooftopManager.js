import * as actionTypes from './actionTypes';

export const initEdgesMap = () => {
  return({
    type: actionTypes.INIT_EDGES_MAP
  });
};

export const initNodesCollection = (newNodesCollection) => {
  return({
    type: actionTypes.INIT_NODES_COLLECTION,
    nodesCollection: newNodesCollection
  });
}

export const searchAllRoofPlanes = () => {
  return({
    type: actionTypes.SEARCH_ALL_ROOF_PLANES
  });
}