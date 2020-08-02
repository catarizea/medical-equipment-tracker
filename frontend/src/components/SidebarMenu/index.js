import React from 'react';
import { injectIntl } from 'react-intl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import PeopleIcon from '@material-ui/icons/People';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import WorkIcon from '@material-ui/icons/Work';
import messages from './messages';

const SidebarMenu = ({ intl: { formatMessage } }) => {
  const routes = {
    first: [
      {
        key: 'patients',
        name: formatMessage(messages.patients),
        icon: <LocalHospitalIcon />,
      },
      {
        key: 'equipment',
        name: formatMessage(messages.equipment),
        icon: <ImportantDevicesIcon />,
      },
      {
        key: 'inventory',
        name: formatMessage(messages.inventory),
        icon: <LocalPharmacyIcon />,
      },
    ],
    second: [
      {
        key: 'locations',
        name: formatMessage(messages.locations),
        icon: <PersonPinCircleIcon />,
      },
      {
        key: 'personnel',
        name: formatMessage(messages.personnel),
        icon: <PeopleIcon />,
      },
      {
        key: 'divisions',
        name: formatMessage(messages.divisions),
        icon: <BubbleChartIcon />,
      },
      {
        key: 'positions',
        name: formatMessage(messages.positions),
        icon: <WorkIcon />,
      },
    ],
  };

  return (
    <>
      <List>
        {routes.first.map((rt, index) => (
          <ListItem button key={rt.key}>
            <ListItemIcon>{rt.icon}</ListItemIcon>
            <ListItemText primary={rt.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {routes.second.map((rt, index) => (
          <ListItem button key={rt.key}>
            <ListItemIcon>{rt.icon}</ListItemIcon>
            <ListItemText primary={rt.name} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default injectIntl(SidebarMenu);
