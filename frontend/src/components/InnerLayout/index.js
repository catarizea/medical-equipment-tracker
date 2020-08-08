import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import ScreenTitle from '../../components/ScreenTitle';
import Breadcrumb from '../../navigation/Breadcrumb';

const InnerLayout = ({ title, breadcrumbItems, children }) => {
  let breadcrumbNode;

  if (breadcrumbItems) {
    breadcrumbNode = (
      <Grid item xs={12}>
        <Breadcrumb items={breadcrumbItems} />
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      {breadcrumbNode}
      <Grid item xs={12}>
        <ScreenTitle>{title}</ScreenTitle>
      </Grid>
      {children}
    </Grid>
  );
};

InnerLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  breadcrumbItems: PropTypes.arrayOf(PropTypes.object.isRequired),
};

export default InnerLayout;
