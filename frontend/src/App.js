import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { IntlProvider } from 'react-intl';
import get from 'lodash.get';

import translationMessages from './i18n/translation.json';
import StoreProvider from './store/reducer/StoreProvider';
import ApolloProvider from './store/apollo/Provider';
// import Home from './screens/Home';
import Login from './screens/Login';
 
const language = get(window, 'navigator.language', 'en').slice(0, 2);
const messages = translationMessages[language];

const App = () => (
  <>
    <CssBaseline />
    <IntlProvider locale={language} messages={messages}>
      <StoreProvider>
        <ApolloProvider>
          <Login />
        </ApolloProvider>
      </StoreProvider>
    </IntlProvider>
  </>
);

export default App;
