import { REQUEST_STATE_DATA } from '../actions/actionTypes'

const INITIAL_STATE = { states: [] };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case REQUEST_STATE_DATA:
      return { ...state, states: action.payload.data, search: action.payload.search };
  }
  return state;
}