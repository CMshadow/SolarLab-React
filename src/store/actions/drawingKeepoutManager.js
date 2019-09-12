import * as Cesium from 'cesium';

import * as actionTypes from './actionTypes';
import Env from '../../infrastructure/keepout/env';
import Vent from '../../infrastructure/keepout/vent';
import Tree from '../../infrastructure/keepout/tree';
import Passage from '../../infrastructure/keepout/passage';
import NormalKeepout from '../../infrastructure/keepout/normalKeepout';

export const setInitialFormTrue = () => {
  return {
    type: actionTypes.SET_INITIALFORM_TRUE
  };
} ;

export const setInitialFormFalse = () => {
  return {
    type: actionTypes.SET_INITIALFORM_FALSE
  };
} ;

export const createKeepout = (values) => {
  let drawingKeepout = null;
  switch (values.type) {
    case 'KEEPOUT':
      drawingKeepout = new NormalKeepout(
        null, values.type, values.height, values.setback
      );
      break;
    case 'PASSAGE':
      drawingKeepout = new Passage(null, values.type, values.passageWidth);
      break;
    case 'VENT':
      drawingKeepout = new Vent(
        null, values.type, values.height, values.setback
      );
      break;
    case 'TREE':
      drawingKeepout = new Tree(null, values.type, values.height);
      break;
    case 'ENV':
      drawingKeepout = new Env(null, values.type, values.height);
      break;
    default:
      drawingKeepout = new NormalKeepout(
        null, 'KEEPOUT', values.height, values.setback
      );
  }
  return {
    type: actionTypes.CREATE_KEEPOUT,
    drawingKeepout: drawingKeepout
  }
};
