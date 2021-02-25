// PACKAGES
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import SearchIcon from "@material-ui/icons/Search";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
// REDUX
import { filterTransactions, searchTransactions } from "../../redux/actions";
// CONSTANTS
import { FILTERS } from "../../lib/constants";

const useToolbarStyles = makeStyles((theme) => ({
  drawer: {
    width: 250,
  },
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: "1 1 100%",
  },
}));

/**
 * @Component
 * The Header component that contains the searchbar and filter drawer toggle
 *
 */
const TableToolbar = () => {
  const classes = useToolbarStyles();

  const dispatch = useDispatch();
  const {
    data: { activeFilters, searchPhrase, transactions },
  } = useSelector((state) => state);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleFilter = (filterKey) => ({ target: { value } }) => {
    dispatch(
      filterTransactions({ [filterKey]: value }, activeFilters, transactions)
    );
  };

  const handleSearch = ({ target: { value } }) => {
    dispatch(searchTransactions(value, transactions));
  };

  const toggleDrawer = (open) => (e) => {
    setDrawerOpen(open);
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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        id="searchbar"
        onChange={handleSearch}
        value={searchPhrase}
        variant="outlined"
      />
      <Tooltip title="Filter list">
        <IconButton aria-label="filter list" onClick={toggleDrawer(true)}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
      <Drawer anchor="right" onClose={toggleDrawer(false)} open={drawerOpen}>
        <div className={clsx(classes.drawer)} role="presentation">
          <List>
            <ListItem>
              <ListItemText>Filter</ListItemText>
            </ListItem>
            <Divider />
            {FILTERS.map((filter) => {
              const val = filter.options.find(
                (option) => option === activeFilters[filter.id]
              );
              return (
                <ListItem key={filter.id}>
                  <Select
                    displayEmpty
                    onChange={handleFilter(filter.id)}
                    placeholder={filter.display}
                    renderValue={(value) => value || filter.display}
                    value={val || filter.display}
                  >
                    <MenuItem key="delete-option" value={filter.display}>
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    </MenuItem>
                    {filter.options.map((option) => (
                      <MenuItem key={`${filter.id}-${option}`} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </ListItem>
              );
            })}
          </List>
        </div>
      </Drawer>
    </Toolbar>
  );
};

export default TableToolbar;
