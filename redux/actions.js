// REDUX
import * as types from "./types";
// INTEGRATIONS
import api, { routes } from "../data/api";
// UTILS
import { makeSearchable, transformTransactionData } from "../lib/helpers";

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
  const filteredTransactions = txs.filter((tx) =>
    tx.searchable.toLowerCase().includes(searchPhrase.toLowerCase())
  );
  dispatch({
    payload: { filteredTransactions, searchPhrase },
    type: types.SEARCH,
  });
};
