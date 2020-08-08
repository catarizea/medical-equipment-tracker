import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import BarcodeScannerComponent from 'react-webcam-barcode-scanner';
import Grid from '@material-ui/core/Grid';

import messages from './messages';
import InnerLayout from '../../components/InnerLayout';
import { ROOT_PATH } from '../../navigation/routes';

const Home = ({ intl: { formatMessage } }) => {
  const [data, setData] = useState('Not Found');
  const breadcrumbItems = [
    {
      key: 'home',
      name: formatMessage(messages.title),
      path: ROOT_PATH,
    },
  ];
  return (
    <InnerLayout
      title={formatMessage(messages.title)}
      breadcrumbItems={breadcrumbItems}>
      <Grid item xs={12}>
        <BarcodeScannerComponent
          width={300}
          height={300}
          interval={200}
          onUpdate={(err, result) => {
            if (result) {
              setData(result.text);
            }

            if (err) {
              console.log(err);
            }
          }}
        />
        <p>{data}</p>
      </Grid>
    </InnerLayout>
  );
};

Home.propTypes = {
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Home);
