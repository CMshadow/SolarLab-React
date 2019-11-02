import * as actionTypes from '../actions/actionTypes';
import NormalKeepout from '../../infrastructure/keepout/normalKeepout';
import Passage from '../../infrastructure/keepout/passage';
import Vent from '../../infrastructure/keepout/vent';
import Tree from '../../infrastructure/keepout/tree';
import Env from '../../infrastructure/keepout/env';

export const bindAllKeepout = () => (dispatch, getState) => {
  const buildingIndex =
    getState().projectManagerReducer.projectInfo.buildingCollection.length;
  const normalKeepout =
    getState().undoableReducer.present.drawingKeepoutPolygonManagerReducer
    .normalKeepout.map(kpt => NormalKeepout.fromKeepout(kpt));
  const passageKeepout =
    getState().undoableReducer.present.drawingKeepoutPolygonManagerReducer
    .passageKeepout.map(kpt => Passage.fromKeepout(kpt));
  const ventKeepout =
    getState().undoableReducer.present.drawingKeepoutPolygonManagerReducer
    .ventKeepout.map(kpt => Vent.fromKeepout(kpt));
  const treeKeepout =
    getState().undoableReducer.present.drawingKeepoutPolygonManagerReducer
    .treeKeepout.map(kpt => Tree.fromKeepout(kpt))
  const envKeepout =
    getState().undoableReducer.present.drawingKeepoutPolygonManagerReducer
    .envKeepout.map(kpt => Env.fromKeepout(kpt))

  return dispatch({
    type: actionTypes.BIND_ALL_KEEPOUT,
    buildingIndex: buildingIndex,
    normalKeepout: normalKeepout,
    passageKeepout: passageKeepout,
    ventKeepout: ventKeepout,
    treeKeepout: treeKeepout,
    envKeepout: envKeepout
  });
};
