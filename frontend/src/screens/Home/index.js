import React, { useContext } from 'react';

import Layout from '../../components/Layout';
import { StoreContext } from '../../store/reducer/StoreProvider';
import { logIn, logOut, fetchUsers } from '../../store/reducer/actions';

const Home = () => {
  const { dispatch, state } = useContext(StoreContext);

  const handleClick = (isLogIn = true) => {
    if (isLogIn) {
      if (state.jwtToken) return;
      logIn(dispatch);
    } else {
      if (!state.jwtToken) return;
      logOut(dispatch);
    }
  };

  return (
    <Layout>
      <div>
        <button onClick={() => handleClick()}>Log In</button>
      </div>
      <br />
      <br />
      <div>
        <button onClick={() => fetchUsers(dispatch)}>Fetch Users</button>
      </div>
      <br />
      <br />
      <div>
        <button onClick={() => handleClick(false)}>Log Out</button>
      </div>
      <p>{JSON.stringify(state.users)}</p>
    </Layout>
  );
};

export default Home;
