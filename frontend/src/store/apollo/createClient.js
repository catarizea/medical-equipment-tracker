import { ApolloClient, InMemoryCache } from '@apollo/client';
import get from 'lodash.get';

import { logOut } from '../reducer/actions';

const createClient = (state, dispatch) => {
  const jwtToken = get(state, 'tokens.jwtToken', null);
  let context = {};

  if (jwtToken) {
    context = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    };
  }

  return new ApolloClient({
    uri:
      process.env.NODE_ENV === 'production'
        ? process.env.REACT_APP_PROD_GRAPHQL_URL
        : process.env.REACT_APP_DEV_GRAPHQL_URL,
    request: (operation) => {
      operation.setContext(context);
    },
    onError: ({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        console.log('graphQLErrors', graphQLErrors);
      }

      if (networkError) {
        console.log('networkError', networkError);
        logOut(dispatch);
      }
    },
    cache: new InMemoryCache(),
  });
};

export default createClient;
