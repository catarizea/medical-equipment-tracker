import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import messages from './messages';
import InnerLayout from '../../components/InnerLayout';
import CodeReader from '../../components/CodeReader';

const Home = ({ intl: { formatMessage } }) => {
  const handleRead = (data) => {
    console.log(data);
  };

  return (
    <InnerLayout title={formatMessage(messages.title)}>
      <Grid item xs={12}>
        <CodeReader handleRead={handleRead} />
      </Grid>
    </InnerLayout>
  );
};

Home.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Home);
