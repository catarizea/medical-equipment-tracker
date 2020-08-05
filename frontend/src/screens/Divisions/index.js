import React from 'react';
import { injectIntl } from 'react-intl';
import { gql, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import homeMessages from '../Home/messages';
import messages from './messages';
import InnerLayout from '../../components/InnerLayout';
import { ROOT_PATH, DIVISIONS_PATH } from '../../navigation/routes';

export const GET_DIVISIONS = gql`
  query GET_DIVISIONS {
    division {
      id
      created_at
      manager_id
      name
    }
  }
`;

const Divisions = ({ intl: { formatMessage } }) => {
  const { error: divisionsError, data: divisionsData, loading } = useQuery(
    GET_DIVISIONS,
  );

  if (loading) return 'Loading...';
  if (divisionsError) return `Error! ${divisionsError.message}`;

  console.log(divisionsData);

  const breadcrumbItems = [
    {
      key: 'home',
      name: formatMessage(homeMessages.title),
      path: ROOT_PATH,
    },
    {
      key: DIVISIONS_PATH.slice(1),
      name: formatMessage(messages.title),
    },
  ];

  return (
    <InnerLayout
      title={formatMessage(messages.title)}
      breadcrumbItems={breadcrumbItems}>
      <Grid item xs={12}>
        <Typography variant="body1">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione
          velit quia voluptate ab, amet ullam natus, culpa quisquam doloremque
          assumenda modi repudiandae facilis obcaecati reprehenderit nemo
          placeat perferendis est nulla?
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione
          velit quia voluptate ab, amet ullam natus, culpa quisquam doloremque
          assumenda modi repudiandae facilis obcaecati reprehenderit nemo
          placeat perferendis est nulla?
        </Typography>
      </Grid>
    </InnerLayout>
  );
};

Divisions.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Divisions);
