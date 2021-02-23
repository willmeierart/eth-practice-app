import {
  CREATED_AT,
  INSERTED_AT,
  TX_BTC,
  TX_ETH,
  TX_FIAT,
} from "../lib/constants";
import { compareAsc, formatISO, fromUnixTime, parseISO } from "date-fns/fp";

export const sortTransactions = (data, sortBy) => {
  return data.sort((a, b) => {
    switch (sortBy) {
      default:
        return compareAsc(parseISO(a.time), parseISO(b.time));
    }
  });
};

export const transformTransactionData = (tx, prices) => {
  const txType = tx.coin ? TX_BTC : tx.blockHeight ? TX_ETH : TX_FIAT;
  const conversionRate = prices[txType];

  const transformedData = {
    state: tx.state,
    type: tx.type,
  };

  switch (txType) {
    case TX_BTC:
    case TX_ETH:
      transformedData.amount = tx.amount / conversionRate;
      transformedData.currency = txType;
      transformedData.time = formatISO(fromUnixTime(tx[INSERTED_AT]));
      break;
    default:
      transformedData.amount = tx.fiatValue;
      transformedData.currency = tx.fiatCurrency;
      transformedData.time = formatISO(new Date(tx[CREATED_AT]));
  }

  return transformedData;
};
