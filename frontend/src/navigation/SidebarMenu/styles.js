import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& a': {
      textDecoration: 'none',
      color: theme.palette.grey[800],
    },
  },
}));

export default useStyles;
