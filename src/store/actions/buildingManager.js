import * as actionTypes from './actionTypes';
import FlatBuilding from '../../infrastructure/building/flatBuilding';
import PitchedBuilding from '../../infrastructure/building/pitchedBuilding';

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