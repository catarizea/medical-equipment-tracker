import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { IntlProvider } from 'react-intl';

import translationMessages from './i18n/translation.json';
import language from './utils/getBrowserLanguage';
import StoreProvider from './store/reducer/StoreProvider';
import ApolloProvider from './store/apollo/Provider';
import RootRouter from './navigation/RootRouter'; 
 
const messages = translationMessages[language];

const App = () => (
  <>
    <CssBaseline />
    <IntlProvider locale={language} messages={messages}>
      <StoreProvider>
        <ApolloProvider>
          <RootRouter />
        </ApolloProvider>
      </StoreProvider>
    </IntlProvider>
  </>
);

export default App;
