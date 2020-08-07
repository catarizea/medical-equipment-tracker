import jwtDecode from 'jwt-decode';
import get from 'lodash.get';

import { logOut } from '../store/reducer/actions';

const getUserInfo = async (jwtToken, dispatch) => {
  let decoded = null;

  try {
    decoded = jwtDecode(jwtToken);
  } catch (error) {
    console.log('Invalid jwtToken', error);
  }

  if (!decoded) {
    await logOut(dispatch);
    return;
  }

  const roles = get(
    decoded,
    `[${process.env.REACT_APP_CLAIMS_KEY}]['x-hasura-allowed-roles']`,
    null,
  );

  const defaultRole = get(
    decoded,
    `[${process.env.REACT_APP_CLAIMS_KEY}]['x-hasura-default-role']`,
    null,
  );

  const userId = get(decoded, `['x-hasura-user-id']`, null);

  if (!roles || !userId || !defaultRole) {
    await logOut(dispatch);
    return;
  }

  return {
    roles,
    defaultRole,
    userId,
  };
};

export default getUserInfo;
