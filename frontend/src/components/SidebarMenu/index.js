import React from 'react';
import { injectIntl } from 'react-intl';
import { useLocation, NavLink } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import HomeIcon from '@material-ui/icons/Home';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import PeopleIcon from '@material-ui/icons/People';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import WorkIcon from '@material-ui/icons/Work';

import messages from './messages';
import {
  ROOT_PATH,
  PATIENTS_PATH,
  EQUIPMENT_PATH,
  INVENTORY_PATH,
  LOCATIONS_PATH,
  PERSONNEL_PATH,
  DIVISIONS_PATH,
  POSITIONS_PATH,
} from '../../navigation/routes';
import useStyles from './styles';

const SidebarMenu = ({ intl: { formatMessage } }) => {
  let location = useLocation();
  const theme = useTheme();
  const classes = useStyles(theme);

  const routes = {
    first: [
      {
        key: 'home',
        name: formatMessage(messages.home),
        icon: <HomeIcon />,
        path: ROOT_PATH,
      },
      {
        key: PATIENTS_PATH.slice(1),
        name: formatMessage(messages.patients),
        icon: <LocalHospitalIcon />,
        path: PATIENTS_PATH,
      },
      {
        key: EQUIPMENT_PATH.slice(1),
        name: formatMessage(messages.equipment),
        icon: <ImportantDevicesIcon />,
        path: EQUIPMENT_PATH,
      },
      {
        key: INVENTORY_PATH.slice(1),
        name: formatMessage(messages.inventory),
        icon: <LocalPharmacyIcon />,
        path: INVENTORY_PATH,
      },
    ],
    second: [
      {
        key: LOCATIONS_PATH.slice(1),
        name: formatMessage(messages.locations),
        icon: <PersonPinCircleIcon />,
        path: LOCATIONS_PATH,
      },
      {
        key: PERSONNEL_PATH.slice(1),
        name: formatMessage(messages.personnel),
        icon: <PeopleIcon />,
        path: PERSONNEL_PATH,
      },
      {
        key: DIVISIONS_PATH.slice(1),
        name: formatMessage(messages.divisions),
        icon: <BubbleChartIcon />,
        path: DIVISIONS_PATH,
      },
      {
        key: POSITIONS_PATH.slice(1),
        name: formatMessage(messages.positions),
        icon: <WorkIcon />,
        path: POSITIONS_PATH,
      },
    ],
  };

  return (
    <div className={classes.root}>
      <List>
        {routes.first.map((rt, index) => (
          <NavLink to={rt.path} key={rt.key}>
            <ListItem button selected={location.pathname === rt.path}>
              <ListItemIcon>{rt.icon}</ListItemIcon>
              <ListItemText primary={rt.name} />
            </ListItem>
          </NavLink>
        ))}
      </List>
      <Divider />
      <List>
        {routes.second.map((rt, index) => (
          <NavLink to={rt.path} key={rt.key}>
            <ListItem button selected={location.pathname === rt.path}>
              <ListItemIcon>{rt.icon}</ListItemIcon>
              <ListItemText primary={rt.name} />
            </ListItem>
          </NavLink>
        ))}
      </List>
    </div>
  );
};

export default injectIntl(SidebarMenu);
