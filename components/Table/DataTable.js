// PACKAGES
import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
// COMPONENTS
import SortableTableHead from "./SortableTableHead";
import TableToolbar from "./TableToolbar";
// UTILS
import { getCompareFunc, getDisplayValue, stableSort } from "../../lib/helpers";
// CONSTANTS
import { ORDERED_COLUMNS } from "../../lib/constants";

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

/**
 * @Component
 * Main display table for transaction data
 * @param {object: {array}} data array of transaction data objects
 *
 */
const DataTable = ({ data }) => {
  const classes = useStyles();

  const {
    data: { loading },
    order: { order, orderBy },
  } = useSelector((state) => state);

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
            stickyHeader
          >
            <SortableTableHead classes={classes} />
            {!loading && (
              <TableBody>
                {stableSort(data, getCompareFunc(order, orderBy)).map(
                  (row, i) => (
                    <TableRow
                      hover
                      key={`row-${i}`} // eslint-disable-line react/no-array-index-key
                    >
                      {ORDERED_COLUMNS.map((column, j) => {
                        const value = row[column];
                        const display = getDisplayValue(value, column);
                        const showTooltip =
                          display && !column.includes("amount");
                        return (
                          <Tooltip
                            key={`cell-${value}-${j}`} // eslint-disable-line react/no-array-index-key
                            title={showTooltip ? value : ""}
                          >
                            <TableCell component="td">
                              {display || value}
                            </TableCell>
                          </Tooltip>
                        );
                      })}
                    </TableRow>
                  )
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        {loading && (
          <div className="loading-wrapper">
            <CircularProgress />
          </div>
        )}
      </Paper>
      <style jsx>
        {`
          .loading-wrapper {
            align-items: center;
            display: flex;
            justify-content: center;
            min-height: 60vh;
            position: absolute;
            min-width: 100vw;
          }
        `}
      </style>
    </div>
  );
};

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default DataTable;
