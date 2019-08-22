import * as actionTypes from './actionTypes';
import FlatBuilding from '../../infrastructure/building/flatBuilding';
import PitchedBuilding from '../../infrastructure/building/pitchedBuilding';

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

    let buildingObj = null;
    if (values.type === 'FLAT') {
      buildingObj = new FlatBuilding(
        values.buildingName,
        buildingSerial,
        values.foundHt,
        values.eaveStb,
        values.parapetHt
      );
    } else {
      buildingObj = new PitchedBuilding(
        values.buildingName,
        buildingSerial,
        values.foundHt,
        values.eaveStb,
        values.hipStb,
        values.ridgeStb,
      );
    }

    return ({
      type: actionTypes.INIT_BUILDING,
      buildingObj: buildingObj,
    });
  };

export const saveBuildingInfoFields = (values) => {
  return ({
    type: actionTypes.SAVE_BUILDING_INFO_FIELDS,
    values: values
  });
};

export const resetBuilding = () => {
  return ({
    type: actionTypes.RESET_BUILDING
  });
};
