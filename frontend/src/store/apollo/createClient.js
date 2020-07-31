import { ApolloClient, InMemoryCache } from '@apollo/client';
import axios from 'axios';
import get from 'lodash.get';

import { logOut, setNewToken } from '../reducer/actions';

const language = get(window, 'navigator.language', 'en').slice(0, 2);

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_REST_URL
    : process.env.REACT_APP_DEV_REST_URL;

const createClient = (state, dispatch) => {
  const jwtToken = get(state, 'jwtToken', null);
  const context = {
    headers: {
      'Accept-Language': language,
    },
  };

  if (jwtToken) {
    context.headers.authorization = `Bearer ${jwtToken}`
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
        let isJwtRejected = false;

        for (let err of graphQLErrors) {
          if (err.extensions.code === 'UNAUTHENTICATED') {
            isJwtRejected = true;
          }
        }

        const previousHeaders = operation.getContext().headers;

        if (isJwtRejected && !previousHeaders.retry) {
          axios({
            url: `${apiUrl}/refresh-token`,
            method: 'post',
            withCredentials: true,
          })
            .then((res) => {
              if (res.status === 200) {
                setNewToken(dispatch, res.data.jwtToken);

                operation.setContext({
                  headers: {
                    ...previousHeaders,
                    authorization: `Bearer ${res.data.jwtToken}`,
                    retry: true,
                  },
                });

                return forward(operation);
              }
            })
            .catch((error) => {
              logOut(dispatch);
            });
        }
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
