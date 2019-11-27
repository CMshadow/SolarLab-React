import * as actionTypes from '../actions/actionTypes';
import axios from '../../axios-setup';
import errorNotification from '../../components/ui/Notification/ErrorNotification';
import Point from '../../infrastructure/point/point';
import FoundLine from '../../infrastructure/line/foundLine';
import Polyline from '../../infrastructure/line/polyline';
import PV from '../../infrastructure/Polygon/PV';
import Polygon from '../../infrastructure/Polygon/Polygon';
import { setBackendLoadingTrue, setBackendLoadingFalse} from './projectManager';
import { setUIStateSetUpWiring } from './uiStateManager';

export const fetchUserInverters = () => (dispatch, getState) => {
  const userID = getState().authReducer.userID;
  dispatch(setBackendLoadingTrue());
  axios.get(`/${userID}/inverter`, {
    params: {
      attributes: JSON.stringify(['inverterName', 'inverterID'])
    }
  })
  .then(response => {
    dispatch({
      type: actionTypes.FETCH_USER_INVERTERS,
      inverterData: response.data.data
    })
    dispatch(setUIStateSetUpWiring());
    return dispatch(setBackendLoadingFalse());
  })
  .catch(error => {
    dispatch(setBackendLoadingFalse());
    return errorNotification(
      'Backend Error',
      error.response.data.errorMessage
    )
  })
}
