// REDUX
import { combineReducers } from "redux";
import * as types from "./types";
// UTILS
import { doFilter, doSearch } from "../lib/helpers";

const initialDataState = {
  activeFilters: {},
  filteredTransactions: [],
  loading: true,
  prices: {},
  searchPhrase: "",
  transactions: [],
};

/**
 * @function
 * Reducer for fetching, filtering, searching data
 * @param {object} state either initial or previous
 * @param {any} action redux action to process payload
 *
 */
const dataReducer = (state = initialDataState, action) => {
  switch (action.type) {
    case types.FETCH_ALL:
      return { ...state, ...action.payload };
    case types.FILTER:
      // Apply searchphrase filter if exists before filters have been applied in action
      // Note that loading state set in reducer here because we want search to complete first
      if (state.searchPhrase.length > 0) {
        return {
          ...state,
          activeFilters: {
            ...action.payload.activeFilters,
          },
          filteredTransactions: doSearch(
            state.searchPhrase,
            action.payload.filteredTransactions
          ),
          loading: false,
        };
      }
      return {
        ...state,
        ...action.payload,
        activeFilters: {
          ...action.payload.activeFilters,
        },
        loading: false,
      };
    case types.SEARCH:
      // Apply filters if any exist after search filters has been applied in action
      if (Object.keys(state.activeFilters).length > 0) {
        return {
          ...state,
          ...action.payload,
          filteredTransactions: doFilter(
            state.activeFilters,
            action.payload.filteredTransactions
          ),
        };
      }
      // Note that loading is handled conditionally in the action
      return { ...state, ...action.payload };
    case types.SET_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const initialOrderState = {
  order: "desc",
  orderBy: "time",
};

/**
 * @function
 * Reducer for ordering transactions by specific properties
 * @param {object} state either initial or previous
 * @param {any} action redux action to process payload
 *
 */
const orderReducer = (state = initialOrderState, action) => {
  switch (action.type) {
    case types.REORDER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const reducers = {
  data: dataReducer,
  order: orderReducer,
};

export default combineReducers(reducers);
