import * as Cesium from 'cesium';

import * as actionTypes from './actionTypes';
import Env from '../../infrastructure/keepout/env';
import Vent from '../../infrastructure/keepout/vent';
import Tree from '../../infrastructure/keepout/tree';
import Passage from '../../infrastructure/keepout/passage';
import NormalKeepout from '../../infrastructure/keepout/normalKeepout';

export const createKeepout = (values) => {
  let newKeepout = null;
  switch (values.type) {
    case 'KEEPOUT':
      newKeepout = new NormalKeepout(
        null, values.type, values.height, values.setback
      );
      break;
    case 'PASSAGE':
      newKeepout = new Passage(null, values.type, values.passageWidth);
      break;
    case 'VENT':
      newKeepout = new Vent(
        null, values.type, values.height, values.setback
      );
      break;
    case 'TREE':
      newKeepout = new Tree(null, values.type, values.height);
      break;
    case 'ENV':
      newKeepout = new Env(null, values.type, values.height);
      break;
    default:
      newKeepout = new NormalKeepout(
        null, 'KEEPOUT', values.height, values.setback
      );
  }
  return {
    type: actionTypes.CREATE_KEEPOUT,
    newKeepout: newKeepout
  }
};

export const updateKeepout = (id, values) => (dispatch, getState) => {
  const keepoutList =
    getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList;
  const updateIndex = keepoutList.findIndex(elem => elem.id === id);
  let updateKeepout = null;
  switch (keepoutList[updateIndex].type) {
    default:
      updateKeepout = NormalKeepout.fromKeepout(
        keepoutList[updateIndex], values.height, values.setback
      );
  }
  return dispatch({
    type: actionTypes.UPDATE_KEEPOUT,
    updateKeepout: updateKeepout,
    updateIndex: updateIndex
  });
};

export const deleteKeepout = (id) => (dispatch, getState) => {
  const keepoutList =
    getState().undoableReducer.present.drawingKeepoutManagerReducer.keepoutList;
  const deleteIndex = keepoutList.findIndex(elem => elem.id === id);
  return dispatch({
    type: actionTypes.DELETE_KEEPOUT,
    deleteIndex: deleteIndex
  });
};
