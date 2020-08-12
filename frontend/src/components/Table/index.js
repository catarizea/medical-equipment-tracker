import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const TableComponent = ({ data, header, minWidth }) => {
  const tableRows = data.map((row) => (
    <TableRow key={row.id}>
      {header.map((cell) => {
        let value = '-';

        if (cell.key in row && row[cell.key] !== null && !cell.showFn) {
          value = row[cell.key];
        }

        if (cell.key in row && row[cell.key] !== null && cell.showFn) {
          value = cell.showFn(row[cell.key]);
        }

        return (
          <TableCell key={cell.key} align={cell.align}>
            {value}
          </TableCell>
        );
      })}
    </TableRow>
  ));

  return (
    <TableContainer component={Paper}>
      <Table style={{ minWidth }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {header.map((cell) => (
              <TableCell key={cell.key} align={cell.alignHeader}>
                {cell.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </TableContainer>
  );
};

TableComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  header: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      alignHeader: PropTypes.string.isRequired,
      align: PropTypes.string.isRequired,
      showFn: PropTypes.func,
    }).isRequired,
  ).isRequired,
  minWidth: PropTypes.number.isRequired,
};

export default TableComponent;
