import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import Grid from '@material-ui/core/Grid';
import get from 'lodash.get';

import homeMessages from '../Home/messages';
import messages from './messages';
import Table from '../../components/Table';
import InnerLayout from '../../components/InnerLayout';
import SectionProgress from '../../components/SectionProgress';
import { ROOT_PATH, PATIENTS_PATH } from '../../navigation/routes';
import {
  age,
  timeAgo,
} from '../../utils/dateConversion';

export const GET_CURRENT_PATIENTS = gql`
  query GET_CURRENT_PATIENTS {
    patient {
      id
      identity_card_ssn
      last_name
      occupation
      is_anonymous
      guardian_name
      gender
      first_name
      birthday
      patient_admissions(where: { discharged_at: { _is_null: true } }) {
        admited_at
        admited_by
        discharged_at
        discharged_by
        comment
      }
    }
  }
`;

const Patients = ({ intl: { formatMessage } }) => {
  const { data, error, loading } = useQuery(GET_CURRENT_PATIENTS, {
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
      key: PATIENTS_PATH.slice(1),
      name: formatMessage(messages.title),
    },
  ];

  let table;

  if (get(data, 'patient[0]', null)) {
    const mappedData = data.patient.map((p) => ({
      name: `${p.first_name} ${p.last_name}`,
      admited_at: p.patient_admissions[0].admited_at,
      comment: p.patient_admissions[0].comment,
      ...p,
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
        key: 'is_anonymous',
        name: formatMessage(messages.isAnonymous),
        alignHeader: 'center',
        align: 'center',
        showFn: (val) =>
          val === true
            ? formatMessage(homeMessages.yes)
            : formatMessage(homeMessages.no),
      },
      {
        key: 'guardian_name',
        name: formatMessage(messages.guardianName),
        alignHeader: 'center',
        align: 'center',
      },
      {
        key: 'identity_card_ssn',
        name: formatMessage(messages.identity),
        alignHeader: 'center',
        align: 'center',
      },
      {
        key: 'gender',
        name: formatMessage(messages.gender),
        alignHeader: 'center',
        align: 'center',
        showFn: (val) =>
          val === true
            ? formatMessage(messages.female)
            : formatMessage(messages.male),
      },
      {
        key: 'birthday',
        name: formatMessage(messages.age),
        alignHeader: 'center',
        align: 'center',
        showFn: (val) =>
          `${age(val)} ${formatMessage(messages.yearsOld, { age: age(val) })}`,
      },
      {
        key: 'admited_at',
        name: formatMessage(messages.admitedSince),
        alignHeader: 'center',
        align: 'center',
        showFn: (str) => timeAgo(str),
      },
      {
        key: 'comment',
        name: formatMessage(messages.comment),
        alignHeader: 'center',
        align: 'center',
      },
      {
        key: 'occupation',
        name: formatMessage(messages.occupation),
        alignHeader: 'center',
        align: 'center',
      },
    ];

    table = <Table data={mappedData} header={header} minWidth={minWidth} />;
  }

  return (
    <InnerLayout
      title={formatMessage(messages.currentPatients)}
      breadcrumbItems={breadcrumbItems}>
      <Grid item xs={12}>
        {table}
      </Grid>
    </InnerLayout>
  );
};

Patients.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Patients);
