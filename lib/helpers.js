// PACKAGES
import { compareAsc, formatISO, fromUnixTime, parseISO } from "date-fns/fp";
// CONSTANTS
import {
  BTC_PER_UNIT,
  CREATED_AT,
  ETH_PER_UNIT,
  INSERTED_AT,
  TX_BTC,
  TX_ETH,
  TX_FIAT,
} from "../lib/constants";

export const transformTransactionData = (tx, prices) => {
  const txType = tx.coin ? TX_BTC : tx.blockHeight ? TX_ETH : TX_FIAT;
  const unitMultiplier = txType === TX_BTC ? BTC_PER_UNIT : ETH_PER_UNIT;
  // const conversionRate = prices[txType];

  const transformedData = {
    state: tx.state,
    type: tx.type,
  };

  switch (txType) {
    case TX_BTC:
    case TX_ETH:
      transformedData.amount = (tx.amount * unitMultiplier).toFixed(8);
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

export const safeDescCompare = (a, b, orderBy) => {
  let valA = { ...a }[orderBy];
  let valB = { ...b }[orderBy];

  if (orderBy === "time") {
    return compareAsc(parseISO(valA), parseISO(valB));
  }

  if (orderBy === "amount") {
    valA = parseFloat(valA);
    valB = parseFloat(valB);
  }

  if (valB < valA) return -1;
  if (valB > valA) return 1;
  return 0;
};

export const getCompareFunc = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => safeDescCompare(a, b, orderBy)
    : (a, b) => -safeDescCompare(a, b, orderBy);
};

export const stableSort = (data, compareFunc) => {
  const stabilized = data.map((el, i) => [el, i]);
  stabilized.sort((a, b) => {
    const order = compareFunc(a[0], b[0]);
    return order || a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
};
