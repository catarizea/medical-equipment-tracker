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
import { ROOT_PATH, DIVISIONS_PATH } from '../../navigation/routes';
import {
  fromUtc,
  formatDate,
  getDateTimeFormat,
} from '../../utils/dateConversion';

export const GET_DIVISIONS = gql`
  query GET_DIVISIONS {
    division {
      id
      created_at
      name
      personnel {
        id
        last_name
        first_name
        title
      }
    }
  }
`;

const Divisions = ({ intl: { formatMessage } }) => {
  const {
    error: divisionsError,
    data: divisionsData,
    loading,
  } = useQuery(GET_DIVISIONS, { fetchPolicy: 'network-only' });

  if (loading) return <SectionProgress />;
  if (divisionsError) return `Error! ${divisionsError.message}`;

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

  let divisionTable;

  if (get(divisionsData, 'division[0]', null)) {
    const minWidth = 650;

    const header = [
      {
        key: 'name',
        name: formatMessage(messages.name),
        alignHeader: 'center',
        align: 'center',
      },
      {
        key: 'personnel',
        name: formatMessage(messages.manager),
        alignHeader: 'center',
        align: 'center',
        showFn: (obj) => `${obj.first_name} ${obj.last_name}, ${obj.title}`,
      },
      {
        key: 'created_at',
        name: formatMessage(homeMessages.createdAt),
        alignHeader: 'center',
        align: 'center',
        showFn: (str) => formatDate(fromUtc(str), getDateTimeFormat()),
      },
    ];

    divisionTable = (
      <Table
        data={divisionsData.division}
        header={header}
        minWidth={minWidth}
      />
    );
  }

  return (
    <InnerLayout
      title={formatMessage(messages.title)}
      breadcrumbItems={breadcrumbItems}>
      <Grid item xs={12}>
        {divisionTable}
      </Grid>
    </InnerLayout>
  );
};

Divisions.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Divisions);
