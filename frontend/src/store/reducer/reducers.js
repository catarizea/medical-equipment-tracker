import match from 'conditional-expression';

import { LOGGED_IN, LOGGED_OUT } from './actionTypes';
import initialState from './initialState';

export const authReducer = (state = initialState, action) => 
  match(action.type)
    .includes('_REQUEST')
      .then({ ...state, isLoading:true })
    .includes('_FAILURE')
      .then({ ...state, isLoading: false, error: action.error })
    .equals(`${LOGGED_IN}_SUCCESS`)
      .then({ ...state, isLoading: false, isAuthenticated: true, tokens: action.data })
    .equals(`${LOGGED_OUT}_SUCCESS`)
      .then({ ...initialState })
    .else({ ...state });
