// PACKAGES
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
// REDUX
import { reorderData } from "../../redux/actions";
// CONSTANTS
import { HEAD_CELLS } from "../../lib/constants";

/**
 * @Component
 * The <th /> of the `DataTable` that allows for custom sorting (via Material UI)
 * @param {object: { object }} classes Material UI css classes passed from parent
 *
 */
const SortableTableHead = ({ classes }) => {
  const dispatch = useDispatch();
  const {
    order: { order, orderBy },
  } = useSelector((state) => state);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    dispatch(reorderData(newOrder, property));
  };

  const onSort = (prop) => (e) => handleSort(prop);

  const isOrderer = (id) => orderBy === id;

  return (
    <TableHead>
      <TableRow>
        {HEAD_CELLS.map(({ id, label }) => (
          <TableCell
            align="left"
            aria-label={`table column ${orderBy} sorted by ${order}`}
            key={`th-${id}`}
            padding="default"
            sortDirection={isOrderer(id) ? order : false}
          >
            <TableSortLabel
              active={isOrderer(id)}
              direction={isOrderer(id) ? order : "asc"}
              onClick={onSort(id)}
            >
              {label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

SortableTableHead.propTypes = {
  classes: PropTypes.object,
};

export default SortableTableHead;
