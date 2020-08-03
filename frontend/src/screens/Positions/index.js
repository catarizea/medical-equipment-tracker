import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';

import { StoreContext } from '../../store/reducer/StoreProvider';
import useStylesCommon from '../stylesCommon';

const Positions = () => {
  const { dispatch, state } = useContext(StoreContext);
  const classesCommon = useStylesCommon();

  return (
    <div className={classesCommon.root}>
      <Typography variant="h1">Positions</Typography>
    </div>
  );
};

export default Positions;
