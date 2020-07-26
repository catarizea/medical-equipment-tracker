import axios from 'axios';
import get from 'lodash.get';

import { setNewTokens } from '../store/reducer/actions'; 

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_REST_URL
    : process.env.REACT_APP_DEV_REST_URL;

const createAxiosClient = (state, dispatch) => {
  const jwtToken = get(state, 'tokens.jwtToken', null);

  const customConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (jwtToken) {
    customConfig.headers['Authorization'] = `Bearer ${jwtToken}`;
  }

  axios.interceptors.request.use(
    (config) => {
      config.headers = { ...config.headers, ...customConfig.headers };
      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const previousRequest = error.config;

      if (
        error.response.status === 401 &&
        error.response.message === 'Invalid JWT token' &&
        !previousRequest.retry
      ) {
        previousRequest.retry = true;
        return axios.post(`${apiUrl}/refresh-token`).then((res) => {
          if (res.status === 200) {
            setNewTokens(dispatch, res.data);
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.jwtToken}`;
            return axios(previousRequest)
          }
        });
      }

      return Promise.reject(error);
    },
  );

  return axios;
};

export default createAxiosClient;
