import { ApolloClient, InMemoryCache } from '@apollo/client';

import { logOut } from '../reducer/actions';

const createClient = (state, dispatch) => {
  const { jwtToken } = state;
  let context = {};

  if (jwtToken) {
    context = {
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    };
  }
  
  return new ApolloClient({
    uri: process.env.HASURA_GRAPHQL_ENDPOINT,
    request: operation => {
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
