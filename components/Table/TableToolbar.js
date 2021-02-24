// PACKAGES
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import FilterListIcon from "@material-ui/icons/FilterList";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
// REDUX
import { searchTransactions } from "../../redux/actions";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: "1 1 100%",
  },
}));

const TableToolbar = () => {
  const dispatch = useDispatch();
  const classes = useToolbarStyles();

  const {
    data: { searchPhrase, transactions },
  } = useSelector((state) => state);

  const handleSearch = ({ target: { value } }) => {
    dispatch(searchTransactions(value, transactions));
  };

  return (
    <Toolbar className={clsx(classes.root)}>
      <Typography
        className={classes.title}
        component="div"
        id="tableTitle"
        variant="h6"
      >
        Transactions
      </Typography>
      <TextField
        fullWidth
        id="searchbar"
        label="Search"
        onChange={handleSearch}
        value={searchPhrase}
        variant="outlined"
      />
      <Tooltip title="Filter list">
        <IconButton aria-label="filter list">
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

export default TableToolbar;
