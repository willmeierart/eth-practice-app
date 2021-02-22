import * as types from "./types";
import api, { routes } from "../data/api";
import { sortTransactions } from "../lib/helpers";

export const fetchAllData = (sortBy) => async (dispatch) => {
  const allData = await routes.reduce(
    async (acc, { name: route }) => {
      const asyncAccumulator = await acc;
      const response = await api.fetch(route);
      const json = await response.json();
      if (route === "prices") {
        asyncAccumulator.prices[route] = json;
      } else {
        asyncAccumulator.transactions = asyncAccumulator.transactions.concat(
          json
        );
      }
      return asyncAccumulator;
    },
    {
      prices: {},
      transactions: [],
    }
  );

  const transactions = sortTransactions(allData.transactions);

  const data = { ...allData, transactions };

  dispatch({
    payload: { data },
    type: types.FETCH_ALL,
  });
};
