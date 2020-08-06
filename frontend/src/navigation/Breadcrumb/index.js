import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { NavLink } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {items.map((item) => {
        if (item.path) {
          return (
            <NavLink to={item.path} key={item.key}>
              <Typography color="textPrimary">{item.name}</Typography>
            </NavLink>
          );
        }

        return (
          <Typography color="textPrimary" key={item.key}>
            {item.name}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string,
    }),
  ).isRequired,
};

export default Breadcrumb;
