import axios from 'axios';
import { REQUEST_STATE_DATA } from './actionTypes'

const API_URL = 'http://localhost:5000/api';

export function requestStateData(stateCode, age, gender) {
  return function (dispatch, getState) {
    const request = `${API_URL}/_state?${stateCode}&age=${age}&gender=${gender}`;
    axios.get(request)
      .then(response => {
        dispatch({
          type: REQUEST_STATE_DATA,
          payload: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      })
  };
}