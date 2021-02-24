// PACKAGES
import debounce from "lodash.debounce";
// REDUX
import * as types from "./types";
// INTEGRATIONS
import api, { routes } from "../data/api";
// UTILS
import {
  doFilter,
  doSearch,
  makeSearchable,
  transformTransactionData,
} from "../lib/helpers";

/**
 * @function
 * Imperatively dispatches loading action
 * @param {bool} loadingState
 *
 */
export const setLoading = (loadingState = true) => (dispatch) => {
  dispatch({
    payload: loadingState,
    type: types.SET_LOADING,
  });
};

/**
 * @function
 * Fetches all data, fired on app load
 *
 */
export const fetchAllData = () => async (dispatch) => {
  const { prices, transactions } = await routes.reduce(
    async (acc, { name: route, tx: isTx }) => {
      const asyncAccumulator = await acc;
      const response = await api.fetch(route);
      const json = await response.json();

      const searchableJson = Array.isArray(json)
        ? json.map(makeSearchable)
        : makeSearchable(json);

      if (isTx) {
        asyncAccumulator.transactions = asyncAccumulator.transactions.concat(
          searchableJson
        );
      } else {
        asyncAccumulator.prices = searchableJson;
      }

      return asyncAccumulator;
    },
    {
      prices: {},
      transactions: [],
    }
  );

  const transformedTxs = transactions.map((tx) =>
    transformTransactionData(tx, prices)
  );

  dispatch({
    payload: {
      filteredTransactions: transformedTxs,
      loading: false,
      prices,
      transactions: transformedTxs,
    },
    type: types.FETCH_ALL,
  });
};

/**
 * @function
 * Reorder transactions via table column headers
 * @param {string} order either 'asc' or 'desc'
 * @param {string} orderBy the name of the property to apply order param to
 *
 */
export const reorderData = (order, orderBy) => (dispatch) => {
  dispatch({
    payload: { order, orderBy },
    type: types.REORDER,
  });
};

/**
 * @function
 * Search for text matches within any field of each of the individual transactions
 * @param {string} searchPhrase the string to search for matches against
 * @param {array} txs the list of transactions to search against
 *
 */
export const searchTransactions = (searchPhrase, txs) => (dispatch) => {
  // Immediately set loading state and update value of textbox...
  dispatch({
    payload: { filteredTransactions: txs, loading: true, searchPhrase },
    type: types.SEARCH,
  });

  // ...but debounce the actual searching a bit since `doSearch` is a heavy func
  const debounceableSearch = () => {
    const filteredTransactions = doSearch(searchPhrase, txs);
    dispatch({
      payload: { filteredTransactions, loading: false, searchPhrase },
      type: types.SEARCH,
    });
  };

  debounce(debounceableSearch, 500)();
};

/**
 * @function
 * Filter for individual transaction matches for certain options of select fields
 * @param {object} filter formatted as `{FIELD: VALUE}`
 * @param {object} filters prev state of `activeFilters`. Necessary here for `doFilter`
 * @param {array} txs the list of transactions to filter against
 *
 */
export const filterTransactions = (filter, prevFilters, txs) => (dispatch) => {
  // Immediately set loading state while subsequent logic runs
  // Note that loading state set back to false in reducer after search logic in this case
  dispatch({
    payload: true,
    type: types.SET_LOADING,
  });

  const newFilters = { ...prevFilters, ...filter };

  const filteredTransactions = doFilter(newFilters, txs);

  dispatch({
    payload: { activeFilters: newFilters, filteredTransactions },
    type: types.FILTER,
  });
};
