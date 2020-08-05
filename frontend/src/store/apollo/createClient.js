import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink,
  fromPromise,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import get from 'lodash.get';
import axios from 'axios';

import { logOut, setNewToken } from '../reducer/actions';
import language from '../../utils/getBrowserLanguage';

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_REST_URL
    : process.env.REACT_APP_DEV_REST_URL;

const httpLink = new HttpLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_PROD_GRAPHQL_URL
      : process.env.REACT_APP_DEV_GRAPHQL_URL,
});

const createClient = (state, dispatch) => {
  const jwtToken = get(state, 'jwtToken', null);

  const context = {
    headers: {
      'Accept-Language': language,
    },
  };

  if (jwtToken) {
    context.headers['Authorization'] = `Bearer ${jwtToken}`;
  }

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(context);
    return forward(operation);
  });

  const errorMiddleware = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        let message = null;
        let type = null;

        for (const err of graphQLErrors) {
          if (!message && !type) {
            message = get(err, 'message', null);
            type = get(err, 'extensions.code', null);
          }
        }

        if (
          message === 'Could not verify JWT: JWTExpired' &&
          type === 'invalid-jwt'
        ) {
          const previousHeaders = operation.getContext().headers;
          
          if (!previousHeaders.retry) {
            return fromPromise(
              axios({
                url: `${apiUrl}/refresh-token`,
                method: 'post',
                withCredentials: true,
              }).catch(() => {
                logOut(dispatch);
              }),
            )
              .filter((value) => Boolean(value))
              .flatMap((res) => {
                setNewToken(dispatch, res.data.jwtToken);

                operation.setContext({
                  headers: {
                    ...previousHeaders,
                    authorization: `Bearer ${res.data.jwtToken}`,
                    retry: true,
                  },
                });

                return forward(operation);
              });
          } else {
            logOut(dispatch);
          }
        }
      }

      if (networkError) {
        console.log(networkError);
        logOut(dispatch);
      }
    },
  );

  const client = new ApolloClient({
    link: from([errorMiddleware, authMiddleware, httpLink]),
    cache: new InMemoryCache(),
  });

  return client;
};

export default createClient;
