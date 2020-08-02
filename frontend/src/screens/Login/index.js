import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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
import Container from '@material-ui/core/Container';
import { injectIntl } from 'react-intl';
import get from 'lodash.get';
import { useHistory, useLocation } from 'react-router-dom';

import PageProgress from '../../components/PageProgress';
import messages from './messages';
import { StoreContext } from '../../store/reducer/StoreProvider';
import { logIn, refreshToken } from '../../store/reducer/actions';
import Copyright from '../../components/Copyright';
import useStyles from './styles';
import schemas from '../../utils/generateSchemas';
import { ROOT_PATH } from '../../navigation/routes';

const LoginScreen = ({ intl: { formatMessage } }) => {
  const classes = useStyles();
  const { dispatch, state } = useContext(StoreContext);
  let history = useHistory();
  let location = useLocation();
  const [retry, setRetry] = useState(0);
  const [isChecking, setIsChecking] = useState(true);

  let { from } = location.state || { from: { pathname: ROOT_PATH } };

  useEffect(() => {
    const checkTokens = async () => {
      if (state.jwtToken) {
        history.replace(from);
      } else {
        if (retry < 1) {
          setRetry(1);
          await refreshToken(dispatch);
          setIsChecking(false);
        }
      }
    };

    checkTokens();
  }, [state, from, history, dispatch, retry]);

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
      validationSchema={schemas.loginSchema}
      onSubmit={handleSubmit}>
      {() => (
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

  if (isChecking) {
    return <PageProgress />;
  }

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
      <Box mt={4} mb={4}>
        <Copyright copy={formatMessage(messages.copy)} />
      </Box>
    </Container>
  );
};

LoginScreen.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(LoginScreen);
