import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { IntlProvider } from 'react-intl';

import translationMessages from './i18n/translation.json';
import StoreProvider from './store/reducer/StoreProvider';
import ApolloProvider from './store/apollo/Provider';

const language = navigator.language.split(/[-_]/)[0] || 'en';
const messages = translationMessages[language];

const App = () => (
  <>
    <CssBaseline />
    <IntlProvider locale={language} messages={messages}>
      <StoreProvider>
        <ApolloProvider>
          <div>
            <h1>Medical Equipment Tracker</h1>
          </div>
        </ApolloProvider>
      </StoreProvider>
    </IntlProvider>
  </>
);

export default App;
