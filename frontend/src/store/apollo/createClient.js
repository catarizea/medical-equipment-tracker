import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  concat,
  ApolloLink,
} from '@apollo/client';
import get from 'lodash.get';
import { onError } from '@apollo/client/link/error';
import language from '../../utils/getBrowserLanguage';

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

  const errorMiddleware = onError(({ networkError }) => {
    if (networkError && networkError.statusCode === 401) {
      console.log(networkError);
    }
  });

  const client = new ApolloClient({
    link: errorMiddleware.concat(concat(authMiddleware, httpLink)),
    cache: new InMemoryCache(),
  });

  return client;
};

export default createClient;
