import React, { useContext } from 'react';
import { ApolloProvider } from '@apollo/client';
import PropTypes from 'prop-types';

import createClient from './createClient';
import { StoreContext } from '../reducer/StoreProvider';

const Provider = ({ children }) => {
  const { state, dispatch } = useContext(StoreContext);
  const client = createClient(state, dispatch);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

Provider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Provider;
