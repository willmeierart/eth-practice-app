// PACKAGES
import React from "react";
import PropTypes from "prop-types";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

const headCells = [
  { align: "right", disablePadding: false, id: "currency", label: "Currency" },
  { align: "left", disablePadding: false, id: "amount", label: "Amount" },
  { disablePadding: false, id: "time", label: "Time" },
  { disablePadding: false, id: "type", label: "Type" },
  { disablePadding: false, id: "state", label: "State" },
];

const SortableTableHead = ({ classes, onSort, order, orderBy }) => {
  const curriedHandler = (prop) => (e) => onSort(e, prop);
  const isOrderer = (id) => orderBy === id;

  return (
    <TableHead>
      <TableRow>
        {headCells.map((hc) => (
          <TableCell
            align={hc.align || "center"}
            key={`th-${hc.id}`}
            padding={hc.disablePadding ? "none" : "default"}
            sortDirection={isOrderer(hc.id) ? order : false}
          >
            <TableSortLabel
              active={isOrderer(hc.id)}
              direction={isOrderer(hc.id) ? order : "asc"}
              onClick={curriedHandler(hc.id)}
            >
              {hc.label}
              {isOrderer(hc.id) ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

SortableTableHead.propTypes = {
  classes: PropTypes.arrayOf(PropTypes.string),
  onSort: PropTypes.func,
  order: PropTypes.string,
  orderBy: PropTypes.number,
};

export default SortableTableHead;
