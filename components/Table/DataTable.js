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

  const {
    data: { loading },
    order: { order, orderBy },
  } = useSelector((state) => state);

  const orderedColumns = [
    "currency",
    "amountFiat",
    "amountCrypto",
    "time",
    "type",
    "state",
    "to",
    "from",
  ];

  const getDisplayValue = (value, column) => {
    if (column === "time") {
      return value.split("T")[0];
    }
    if (typeof value === "number") {
      return value.toLocaleString(undefined, { maximumFractionDigits: 8 });
    }
    if (typeof value === "string" && value.length > 13) {
      return `${value.substring(0, 10)}...`;
    }
  };

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
            {loading ? (
              <div className="loading-wrapper">
                <CircularProgress />
              </div>
            ) : (
              <TableBody>
                {stableSort(data, getCompareFunc(order, orderBy)).map(
                  (row, i) => (
                    <TableRow
                      hover
                      key={`row-${i}`} // eslint-disable-line react/no-array-index-key
                    >
                      {orderedColumns.map((column, j) => {
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
      </Paper>
      <style jsx>
        {`
          .loading-wrapper {
            display: flex;
            justify-content: center;
            position: absolute;
            width: 100%;
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
