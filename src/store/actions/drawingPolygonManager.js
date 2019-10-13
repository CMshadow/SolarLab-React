import * as actionTypes from './actionTypes';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';

export const createPolygonFoundation = (newHeight, coordinatesArray) => {
  return ({
    type: actionTypes.CREATE_POLYGON_FOUNDATION,
        height: newHeight,
        coordinatesArray: coordinatesArray
  });
};

export const setUpPolygonFoundation = () => {
  return ({
    type: actionTypes.SET_POLYGON_FOUNDATION
  });
};
