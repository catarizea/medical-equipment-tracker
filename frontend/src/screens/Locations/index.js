import React from 'react';
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
import { ROOT_PATH, LOCATIONS_PATH } from '../../navigation/routes';

export const GET_LOCATIONS = gql`
  query GET_LOCATIONS {
    location {
      id
      name
      personnel {
        first_name
        last_name
        position {
          name
        }
      }
      division {
        name
      }
    }
  }
`;

const Locations = ({ intl: { formatMessage } }) => {
  const { data, error, loading } = useQuery(GET_LOCATIONS, {
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
      key: LOCATIONS_PATH.slice(1),
      name: formatMessage(messages.title),
    },
  ];

  let table;

  if (get(data, 'location[0]', null)) {
    const mappedData = data.location.map((p) => ({
      id: p.id,
      name: p.name,
      manager: `${p.personnel.first_name} ${p.personnel.last_name}, ${p.personnel.position.name}`,
      division: p.division.name
    }));

    const minWidth = 650;

    const header = [
      {
        key: 'name',
        name: formatMessage(messages.name),
        alignHeader: 'center',
        align: 'center',
      },
      {
        key: 'division',
        name: formatMessage(messages.division),
        alignHeader: 'center',
        align: 'center',
      },
      {
        key: 'manager',
        name: formatMessage(messages.manager),
        alignHeader: 'center',
        align: 'center',
      },
    ];

    table = <Table data={mappedData} header={header} minWidth={minWidth} />;
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

Locations.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Locations);
