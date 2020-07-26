import axios from 'axios';

import { setNewToken, logOut } from '../store/reducer/actions';

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_REST_URL
    : process.env.REACT_APP_DEV_REST_URL;

const createAxiosClient = (dispatch) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const previousRequest = error.config;

      if (
        error.response.status === 401 &&
        error.response.data.message === 'Invalid JWT token' &&
        !previousRequest.retry
      ) {
        previousRequest.retry = true;
        return axios({
          url: `${apiUrl}/refresh-token`,
          method: 'post',
          withCredentials: true,
        })
          .then((res) => {
            if (res.status === 200) {
              setNewToken(dispatch, res.data.jwtToken);
              axios.defaults.headers.common[
                'Authorization'
              ] = `Bearer ${res.data.jwtToken}`;
              return axios(previousRequest);
            }
          })
          .catch((error) => {
            logOut(dispatch);
            Promise.reject(error);
          });
      }

      return Promise.reject(error);
    },
  );

  return axios;
};

export default createAxiosClient;
