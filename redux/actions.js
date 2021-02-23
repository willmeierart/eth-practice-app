import * as types from "./types";
import api, { routes } from "../data/api";
import { sortTransactions, transformTransactionData } from "../lib/helpers";

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
  const sortedTxs = sortTransactions(transformedTxs);

  const data = { prices, transactions: sortedTxs };

  dispatch({
    payload: data,
    type: types.FETCH_ALL,
  });
};
