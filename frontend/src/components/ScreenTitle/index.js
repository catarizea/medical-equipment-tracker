import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const ScreenTitle = ({ children }) => {
  return <Typography variant="h1">{children}</Typography>;
};

Screen.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default ScreenTitle;
