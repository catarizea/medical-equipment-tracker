import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { StoreContext } from '../../store/reducer/StoreProvider';
import { LOGIN_PATH } from '../routes';

const PrivateRoute = ({ children, ...rest }) => {
  const { state } = useContext(StoreContext);
  
  return (
    <Route
      {...rest}
      render={({ location }) =>
        state.jwtToken ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: LOGIN_PATH,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default PrivateRoute;
