import axios from 'axios';
import { REQUEST_STATE_DATA } from './actionTypes'

const API_URL = 'http://localhost:5000';

export function requestStateData(search, year, gender) {
  return function (dispatch, getState) {
    let request = `${API_URL}/${search}?`;
    if(year && year !== 'NO FILTER'){
      request += `year=${year}&`;
    }
    if(gender && gender !== 'NO FILTER'){
      request += `gender=${gender}`;
    }

    axios.get(request)
      .then(response => {
        dispatch({
          type: REQUEST_STATE_DATA,
          payload: { search: search, data: response.data }
        });
      })
      .catch((error) => {
        console.log(error);
      })
  };
}