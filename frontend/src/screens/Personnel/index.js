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
import { ROOT_PATH, PERSONNEL_PATH } from '../../navigation/routes';
import {
  timeAgoDate,
} from '../../utils/dateConversion';

export const GET_ACTIVE_PERSONNEL = gql`
  query GET_ACTIVE_PERSONNEL {
    personnel(where: { is_employed: { _eq: true } }) {
      id
      first_name
      last_name
      email
      employed_at
      phone
      title
      position {
        name
      }
      division {
        name
      }
    }
  }
`;

const Personnel = ({ intl: { formatMessage } }) => {
  const { data, error, loading } = useQuery(GET_ACTIVE_PERSONNEL, {
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
      key: PERSONNEL_PATH.slice(1),
      name: formatMessage(messages.title),
    },
  ];

  let table;

  if (get(data, 'personnel[0]', null)) {
    const mappedData = data.personnel.map((p) => ({
      ...p,
      division: p.division.name,
      position: p.position.name,
      name: `${p.first_name} ${p.last_name}, ${p.title}`,
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
        key: 'position',
        name: formatMessage(messages.position),
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
        key: 'phone',
        name: formatMessage(messages.phone),
        alignHeader: 'center',
        align: 'center',
      },
      {
        key: 'email',
        name: formatMessage(messages.email),
        alignHeader: 'center',
        align: 'center',
      },
      {
        key: 'employed_at',
        name: formatMessage(messages.employedSince),
        alignHeader: 'center',
        align: 'center',
        showFn: (val) => timeAgoDate(val),
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

Personnel.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Personnel);
