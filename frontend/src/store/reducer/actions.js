import { LOGGED_IN, LOGGED_OUT, SET_NEW_TOKENS } from './actionTypes';

export const logIn = (dispatch, credentials) => {
  dispatch({
    type: LOGGED_IN,
    payload: {
      request: {
        url: '/login',
        method: 'post',
        body: { email: 'catalin@medical.equipment', password: 'Password1' },
      },
    },
  });
};

export const logOut = (dispatch) => {
  dispatch({
    type: LOGGED_OUT,
    payload: {
      request: {
        url: '/logout',
        method: 'get',
      },
    },
  });
};

export const setNewTokens = (dispatch, tokens) => {
  dispatch({
    type: SET_NEW_TOKENS,
    payload: {
      tokens,
    },
  });
};
