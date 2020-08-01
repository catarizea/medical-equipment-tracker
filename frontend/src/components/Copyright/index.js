import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

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

Copyright.propTypes = {
  copy: PropTypes.string.isRequired,
};

export default Copyright;
