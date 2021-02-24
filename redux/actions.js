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

// Imperatively set loading state
export const setLoading = (loadingState = true) => (dispatch) => {
  dispatch({
    payload: loadingState,
    type: types.SET_LOADING,
  });
};

// Fetch all data, fired on app load
export const fetchAllData = (sortBy) => async (dispatch) => {
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

  const data = {
    filteredTransactions: transformedTxs,
    loading: false,
    prices,
    transactions: transformedTxs,
  };

  dispatch({
    payload: data,
    type: types.FETCH_ALL,
  });
};

// Reorder data via table column headers
export const reorderData = (order, orderBy) => (dispatch) => {
  dispatch({
    payload: { order, orderBy },
    type: types.REORDER,
  });
};

// Search for text matches within any field of each of the individual transactions
export const searchTransactions = (searchPhrase, txs) => (dispatch) => {
  // Immediately set loading state and update value of textbox...
  dispatch({
    payload: { filteredTransactions: txs, loading: true, searchPhrase },
    type: types.SEARCH,
  });

  // ...but debounce the actual searching a bit
  const searchRate = 500;

  const debounceableSearch = () => {
    const filteredTransactions = doSearch(searchPhrase, txs);
    dispatch({
      payload: { filteredTransactions, loading: false, searchPhrase },
      type: types.SEARCH,
    });
  };

  debounce(debounceableSearch, searchRate)();
};

export const filterTransactions = (filter, filters, txs) => (dispatch) => {
  // Immediately set loading state while subsequent logic runs
  // Loading state set back to false in reducer after search logic in this case
  dispatch({
    payload: true,
    type: types.SET_LOADING,
  });

  const newFilters = { ...filters, ...filter };

  const filteredTransactions = doFilter(newFilters, filter, txs);

  dispatch({
    payload: { activeFilters: newFilters, filteredTransactions },
    type: types.FILTER,
  });
};
