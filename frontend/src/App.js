import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { IntlProvider } from 'react-intl';

import translationMessages from './i18n/translation.json';
import language from './utils/getBrowserLanguage';
import StoreProvider from './store/reducer/StoreProvider';

import RootRouter from './navigation/RootRouter';
import theme from './constants/theme';

const messages = translationMessages[language];

const App = () => (
  <>
    <CssBaseline />
    <IntlProvider locale={language} messages={messages}>
      <StoreProvider>
        <ThemeProvider theme={theme}>
          <RootRouter />
        </ThemeProvider>
      </StoreProvider>
    </IntlProvider>
  </>
);

export default App;
