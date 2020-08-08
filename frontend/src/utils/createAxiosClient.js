import axios from 'axios';
import get from 'lodash.get';

import { setNewToken, logOut } from '../store/reducer/actions';
import language from './getBrowserLanguage';

const baseURL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_REST_URL
    : process.env.REACT_APP_DEV_REST_URL;

const createAxiosClient = (dispatch, state) => {
  const axiosApiInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': language
    },
  });

  axiosApiInstance.interceptors.request.use(
    (config) => {
      if (state.jwtToken && !config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${state.jwtToken}`;
      }
      
      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );

  axiosApiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const previousRequest = error.config;

      if (
        get(error, 'response.status', null) === 401 &&
        get(error, 'response.data.message', null) === 'Invalid JWT token' &&
        !previousRequest._retry
      ) {
        previousRequest._retry = true;

        try {
          const res = await axios({
            url: `${baseURL}/refresh-token`,
            method: 'post',
            withCredentials: true,
          });

          if (res.status === 200) {
            setNewToken(dispatch, res.data.jwtToken);
            previousRequest.headers['Authorization'] = `Bearer ${res.data.jwtToken}`;
            return axiosApiInstance(previousRequest);
          }
        } catch (error) {
          logOut(dispatch);
          return Promise.reject(error);
        }
      }
      
      return Promise.reject(error);
    },
  );

  return axiosApiInstance;
};

export default createAxiosClient;
