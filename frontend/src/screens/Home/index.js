import React, { useContext } from 'react';

import { StoreContext } from '../../store/reducer/StoreProvider';
import { logIn, logOut } from '../../store/reducer/actions';

const Home = () => {
  const { dispatch } = useContext(StoreContext);

  const handleClick = (isLogIn = true) => {
    if (isLogIn) {
      logIn(dispatch);
    } else {
      logOut(dispatch);
    }
  };

  return (
    <>
      <div>
        <button onClick={() => handleClick()}>Log In</button>
      </div>
      <br />
      <div>
        <button onClick={() => handleClick(false)}>Log Out</button>
      </div>
    </>
  );
};

export default Home;
