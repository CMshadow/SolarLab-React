import * as actionTypes from './actionTypes';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';

export const createPolygonFoundation = (newHeight, coordinatesArray) => {
  console.log('action')
  return dispatch => {
    axios.get('/test')
    .then(response => {
      console.log(response)
      dispatch({
        type: actionTypes.CREATE_POLYGON_FOUNDATION,
        height: newHeight,
        coordinatesArray: coordinatesArray
      })
    })
    .catch(error => {
      return errorNotification(
        'Backend Error',
        error
      )
    });
  };
};

export const setUpPolygonFoundation = () => {
  return ({
    type: actionTypes.SET_POLYGON_FOUNDATION
  });
};
