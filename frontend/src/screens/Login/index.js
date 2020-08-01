import React, { useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { injectIntl } from 'react-intl';
import get from 'lodash.get';

import messages from './messages';
import { generateSchemas } from '@medical-equipment-tracker/validator';
import language from '../../utils/getBrowserLanguage';
import { StoreContext } from '../../store/reducer/StoreProvider';
import { logIn } from '../../store/reducer/actions';

const { loginSchema } = generateSchemas(language);

const Copyright = ({ copy }) => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link color="inherit" href={process.env.REACT_APP_HOST_URL}>
        {copy}
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LoginScreen = ({ intl: { formatMessage } }) => {
  const classes = useStyles();
  const { dispatch, state } = useContext(StoreContext);

  const handleSubmit = async (values, actions) => {
    const res = await logIn(dispatch, values);
    if (res.error) {
      actions.setFieldError(
        'email',
        get(res.error, 'message', formatMessage(messages.genericError)),
      );
    }
  };

  const form = (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}>
      {({ submitForm }) => (
        <Form className={classes.form} noValidate>
          <Field
            component={TextField}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={formatMessage(messages.email)}
            name="email"
            autoComplete="email"
            autoFocus
          />
          <Field
            component={TextField}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={formatMessage(messages.password)}
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {state.isLoading && <LinearProgress />}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={state.isLoading}
            className={classes.submit}>
            {formatMessage(messages.login)}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                {formatMessage(messages.forgot)}
              </Link>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {formatMessage(messages.login)}
        </Typography>
        {form}
      </div>
      <Box mt={4}>
        <Copyright copy={formatMessage(messages.copy)} />
      </Box>
    </Container>
  );
};

export default injectIntl(LoginScreen);
