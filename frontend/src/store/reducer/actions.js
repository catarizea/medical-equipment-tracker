import {
  LOGGED_IN,
  LOGGED_OUT,
  SET_NEW_TOKEN,
  REFRESH_TOKEN,
  FETCH_USERS,
} from './actionTypes';

export const logIn = async (dispatch, credentials) => {
  const res = await dispatch({
    type: LOGGED_IN,
    payload: {
      request: {
        url: '/login',
        method: 'post',
        body: { ...credentials },
      },
    },
  });

  return res;
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

export const setNewToken = (dispatch, jwtToken) => {
  dispatch({
    type: SET_NEW_TOKEN,
    jwtToken,
  });
};

export const refreshToken = (dispatch) => {
  dispatch({
    type: REFRESH_TOKEN,
    payload: {
      request: {
        url: '/refresh-token',
        method: 'post',
      },
    },
  });
};

export const fetchUsers = (dispatch, query = null) => {
  dispatch({
    type: FETCH_USERS,
    payload: {
      request: {
        url: '/fetch-users',
        method: 'get',
      },
    },
  });
};
