import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import useStylesCommon from '../stylesCommon';
import messages from './messages';

const Home = ({ intl: { formatMessage } }) => {
  const classesCommon = useStylesCommon();

  return (
    <div className={classesCommon.root}>
      <Typography variant="h1">{formatMessage(messages.title)}</Typography>
    </div>
  );
};

Home.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Home);