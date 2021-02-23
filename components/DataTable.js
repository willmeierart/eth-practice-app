import React from "react";
import PropTypes from "prop-types";
import { Table, TableCell, TableRow } from "@blockchain-com/components";

const DataTable = ({ data }) => {
  return (
    <Table>
      <TableRow>
        {Object.keys(data[0]).map((heading, i) => (
          <TableCell key={`th-${i}`}>{heading}</TableCell>
        ))}
      </TableRow>
      {data.map((tx, i) => (
        <TableRow key={`tr-${i}`}>
          {Object.values(tx).map((val, j) => (
            <TableCell key={`tr-${j}`}>{val}</TableCell>
          ))}
        </TableRow>
      ))}
    </Table>
  );
};

export default DataTable;

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};
