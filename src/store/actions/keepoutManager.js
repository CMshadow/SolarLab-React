import * as actionTypes from '../actions/actionTypes';
import NormalKeepout from '../../infrastructure/keepout/normalKeepout';
import Passage from '../../infrastructure/keepout/passage';
import Vent from '../../infrastructure/keepout/vent';
import Tree from '../../infrastructure/keepout/tree';
import Env from '../../infrastructure/keepout/env';

export const bindAllKeepout = () => (dispatch, getState) => {
  const buildingIndex =
    getState().undoable.present.projectManager.projectInfo
    .buildingGroupCollection.length;
  const normalKeepout =
    getState().undoable.present.drawingKeepoutPolygonManager.normalKeepout
    .map(kpt => NormalKeepout.fromKeepout(kpt));
  const passageKeepout =
    getState().undoable.present.drawingKeepoutPolygonManager.passageKeepout
    .map(kpt => Passage.fromKeepout(kpt));
  const ventKeepout =
    getState().undoable.present.drawingKeepoutPolygonManager.ventKeepout
    .map(kpt => Vent.fromKeepout(kpt));
  const treeKeepout =
    getState().undoable.present.drawingKeepoutPolygonManager.treeKeepout
    .map(kpt => Tree.fromKeepout(kpt))
  const envKeepout =
    getState().undoable.present.drawingKeepoutPolygonManager.envKeepout
    .map(kpt => Env.fromKeepout(kpt))

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
