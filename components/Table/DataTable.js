// PACKAGES
import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
// COMPONENTS
import SortableTableHead from "./SortableTableHead";
import TableToolbar from "./TableToolbar";
// UTILS
import { getCompareFunc, stableSort } from "../../lib/helpers";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(2),
    width: "100%",
  },
  root: {
    width: "100%",
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const DataTable = ({ data }) => {
  const classes = useStyles();
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("amount");

  const handleSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const orderedColumns = ["currency", "amount", "time", "type", "state"];

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableToolbar />
        <TableContainer>
          <Table
            aria-label="data table"
            aria-labelledby="tableTitle"
            className={classes.table}
            size="small"
          >
            <SortableTableHead
              classes={classes}
              onSort={handleSort}
              order={order}
              orderBy={orderBy}
            />
            <TableBody>
              {stableSort(data, getCompareFunc(order, orderBy)).map(
                (row, i) => (
                  <TableRow hover key={row.name}>
                    {orderedColumns.map((column) => (
                      <TableCell component="td" key={`cell-${column}`}>
                        {row[column]}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default DataTable;

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};
