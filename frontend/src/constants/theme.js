import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: '3rem',
    },
    h2: {
      fontSize: '2.75rem',
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 300,
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 300,
    },
    h5: {
      fontSize: '1.75rem',
      fontWeight: 300,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 300,
    }
  },
});

theme = {
  ...theme,
  overrides: {
    MuiLinearProgress: {
      indeterminate: {
        backgroundColor: theme.palette.grey[200],
      },
      bar1Indeterminate: {
        backgroundColor: theme.palette.info.dark,
      },
      bar2Indeterminate: {
        backgroundColor: theme.palette.info.main,
      }
    }
  }
};

theme = responsiveFontSizes(theme);

export default theme;