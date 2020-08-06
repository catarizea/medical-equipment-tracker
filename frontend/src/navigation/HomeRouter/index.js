import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Layout from '../../components/Layout';
import Home from '../../screens/Home';
import Patients from '../../screens/Patients';
import Equipment from '../../screens/Equipment';
import Inventory from '../../screens/Inventory';
import Locations from '../../screens/Locations';
import Personnel from '../../screens/Personnel';
import Divisions from '../../screens/Divisions';
import Positions from '../../screens/Positions';

import {
  ROOT_PATH,
  PATIENTS_PATH,
  EQUIPMENT_PATH,
  INVENTORY_PATH,
  LOCATIONS_PATH,
  PERSONNEL_PATH,
  DIVISIONS_PATH,
  POSITIONS_PATH,
} from '../routes';

const HomeRouter = () => (
  <Router>
    <Layout>
      <Switch>
        <Route path={PATIENTS_PATH} key={PATIENTS_PATH.slice(1)} exact>
          <Patients />
        </Route>
        <Route path={EQUIPMENT_PATH} key={EQUIPMENT_PATH.slice(1)} exact>
          <Equipment />
        </Route>
        <Route path={INVENTORY_PATH} key={INVENTORY_PATH.slice(1)} exact>
          <Inventory />
        </Route>
        <Route path={LOCATIONS_PATH} key={LOCATIONS_PATH.slice(1)} exact>
          <Locations />
        </Route>
        <Route path={PERSONNEL_PATH} key={PERSONNEL_PATH.slice(1)} exact>
          <Personnel />
        </Route>
        <Route path={DIVISIONS_PATH} key={DIVISIONS_PATH.slice(1)} exact>
          <Divisions />
        </Route>
        <Route path={POSITIONS_PATH} key={POSITIONS_PATH.slice(1)} exact>
          <Positions />
        </Route>
        <Route path={ROOT_PATH} key="home">
          <Home />
        </Route>
      </Switch>
    </Layout>
  </Router>
);

export default HomeRouter;
