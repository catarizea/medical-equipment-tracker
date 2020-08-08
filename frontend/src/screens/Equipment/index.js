import React from 'react';
import { injectIntl } from 'react-intl';
import { gql, useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import get from 'lodash.get';

import Table from '../../components/Table';
import SectionProgress from '../../components/SectionProgress';
import homeMessages from '../Home/messages';
import messages from './messages';
import InnerLayout from '../../components/InnerLayout';
import { ROOT_PATH, EQUIPMENT_PATH } from '../../navigation/routes';
import {
  fromUtc,
  formatDate,
  getDateTimeFormat,
} from '../../utils/dateConversion';

export const GET_EQUIPMENT = gql`
  query GET_EQUIPMENT {
    equipment {
      id
      name
      created_at
      inventory_system_id
      status
      updated_at
      personnel {
        first_name
        last_name
        position {
          name
        }
        division {
          name
        }
      }
    }
  }
`;

const Equipment = ({ intl: { formatMessage } }) => {
  const { data, error, loading } = useQuery(GET_EQUIPMENT, {
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
      key: EQUIPMENT_PATH.slice(1),
      name: formatMessage(messages.title),
    },
  ];

  let table;

  if (get(data, 'equipment[0]', null)) {
    const minWidth = 650;

    const header = [
      {
        key: 'name',
        name: formatMessage(messages.name),
        alignHeader: 'center',
        align: 'center',
      },
      {
        key: 'inventory_system_id',
        name: formatMessage(homeMessages.systemId),
        alignHeader: 'center',
        align: 'center',
      },
      {
        key: 'status',
        name: formatMessage(messages.status),
        alignHeader: 'center',
        align: 'center',
      },
      {
        key: 'personnel',
        name: formatMessage(messages.owner),
        alignHeader: 'center',
        align: 'center',
        showFn: (obj) =>
          `${obj.first_name} ${obj.last_name}, ${obj.position.name}, ${obj.division.name}`,
      },
      {
        key: 'created_at',
        name: formatMessage(homeMessages.createdAt),
        alignHeader: 'center',
        align: 'center',
        showFn: (str) => formatDate(fromUtc(str), getDateTimeFormat()),
      },
      {
        key: 'updated_at',
        name: formatMessage(homeMessages.updatedAt),
        alignHeader: 'center',
        align: 'center',
        showFn: (str) => formatDate(fromUtc(str), getDateTimeFormat()),
      },
    ];

    table = (
      <Table data={data.equipment} header={header} minWidth={minWidth} />
    );
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

Equipment.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Equipment);
