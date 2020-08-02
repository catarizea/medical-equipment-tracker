import match from 'conditional-expression';
import get from 'lodash.get';

import { LOGGED_IN, LOGGED_OUT, SET_NEW_TOKEN, FETCH_USERS, REFRESH_TOKEN } from './actionTypes';
import initialState from './initialState';

export const authReducer = (state, action) => 
  match(action.type)
    .includes('_REQUEST')
      .then({ ...state, isLoading:true, error: null })
    .includes('_FAILURE')
      .then({ ...state, isLoading: false, error: action.error })
    .equals(`${LOGGED_IN}_SUCCESS`)
      .then({ ...state, isLoading: false, jwtToken: get(action, 'data.jwtToken', null) })
    .equals(`${LOGGED_OUT}_SUCCESS`)
      .then({ ...initialState })
    .equals(SET_NEW_TOKEN)
      .then({ ...state, jwtToken: action.jwtToken })
    .equals(`${REFRESH_TOKEN}_SUCCESS`)
      .then({ ...state, isLoading: false, jwtToken: get(action, 'data.jwtToken', null) })
    .equals(`${FETCH_USERS}_SUCCESS`)
      .then({ ...state, isLoading: false, users: action.data })
    .else({ ...state });
