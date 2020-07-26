import React from 'react';
import PropTypes from 'prop-types';

import { authReducer } from './reducers';
import initialState from './initialState';
import useAxiosReducer from '../../hooks/useAxiosReducer';

export const StoreContext = React.createContext();

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useAxiosReducer(
    authReducer,
    initialState,
    process.env.NODE_ENV === 'development',
  );

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

StoreProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default StoreProvider;
