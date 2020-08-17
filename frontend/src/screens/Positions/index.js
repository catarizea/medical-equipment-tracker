import React, { useContext } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import get from 'lodash.get';

import InnerLayout from '../../components/InnerLayout';
import Table from '../../components/Table';
import homeMessages from '../Home/messages';
import messages from './messages';
import SectionProgress from '../../components/SectionProgress';
import { ROOT_PATH, POSITIONS_PATH } from '../../navigation/routes';

export const GET_POSITIONS = gql`
  query GET_POSITIONS {
    position {
      id
      name
    }
  }
`;

const Positions = ({ intl: { formatMessage } }) => {
  const { data, error, loading } = useQuery(GET_POSITIONS, {
    fetchPolicy: 'network-only',
  });

  if (loading) return <SectionProgress />;
  if (error) return `Error! ${error.message}`;

  const breadcrumbItems = [
    {
      key: 'home',
      name: formatMessage(homeMessages.title),
      path: ROOT_PATH,
    },
    {
      key: POSITIONS_PATH.slice(1),
      name: formatMessage(messages.title),
    },
  ];

  let table;

  if (get(data, 'position[0]', null)) {
    const minWidth = 350;

    const header = [
      {
        key: 'name',
        name: formatMessage(messages.name),
        alignHeader: 'center',
        align: 'center',
      },
    ];

    table = <Table data={data.position} header={header} minWidth={minWidth} />;
  }

  return (
    <InnerLayout
      title={formatMessage(messages.title)}
      breadcrumbItems={breadcrumbItems}>
      <Grid item xs={12}>
        {table}
      </Grid>
    </InnerLayout>
  );
};

Positions.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Positions);
