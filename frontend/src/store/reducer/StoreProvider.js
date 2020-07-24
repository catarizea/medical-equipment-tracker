import React, { useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';

import { authReducer } from './reducers';
import initialState from './initialState';

export const StoreContext = React.createContext();

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

StoreProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default StoreProvider;
