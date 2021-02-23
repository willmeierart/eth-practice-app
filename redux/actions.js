// REDUX
import * as types from "./types";
// INTEGRATIONS
import api, { routes } from "../data/api";
// UTILS
import { transformTransactionData } from "../lib/helpers";

// Fetch all data, fired on app load
export const fetchAllData = (sortBy) => async (dispatch) => {
  const { prices, transactions } = await routes.reduce(
    async (acc, { name: route, tx: isTx }) => {
      const asyncAccumulator = await acc;
      const response = await api.fetch(route);
      const json = await response.json();
      if (isTx) {
        asyncAccumulator.transactions = asyncAccumulator.transactions.concat(
          json
        );
      } else {
        asyncAccumulator.prices = json;
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

  const data = { prices, transactions: transformedTxs };

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
