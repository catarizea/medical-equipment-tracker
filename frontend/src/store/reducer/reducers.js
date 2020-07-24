import { LOGGED_IN, LOGGED_OUT } from './actionTypes';
import initialState from './initialState';

export const authReducer = (state, action) => {
  switch (action.type) {
    case LOGGED_IN:
      return { ...state, isAuthenticated: true };
    case LOGGED_OUT:
      return { ...initialState };
    default:
      return { ...state };
  }
};
