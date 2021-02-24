// PACKAGES
import { compareAsc, formatISO, fromUnixTime, parseISO } from "date-fns/fp";
// CONSTANTS
import {
  BTC,
  BTC_PER_UNIT,
  BTC_WALLET,
  CREATED_AT,
  ETH,
  ETH_PER_UNIT,
  ETH_WALLET,
  FIAT,
  INSERTED_AT,
  USD,
} from "../lib/constants";

export const getCryptoFromFiat = (txPair) => {
  const coins = txPair.split("-");
  return coins[0] === USD ? coins[1] : coins[0];
};

export const getFiatConversion = (tx, prices) => {
  const crypto = getCryptoFromFiat(tx.pair);
  const conversion = prices[crypto];
  const convertedValue =
    tx.type === "buy" ? tx.fiatValue / conversion : tx.fiatValue * conversion;
  return parseFloat(convertedValue.toFixed(8));
};

export const getFiatDests = (tx) => {
  const crypto = getCryptoFromFiat(tx.pair);
  const wallet = crypto === "ETH" ? ETH_WALLET : BTC_WALLET;
  return tx.type === "buy"
    ? { from: tx.id, to: wallet }
    : { from: wallet, to: tx.id };
};

export const transformTransactionData = (tx, prices) => {
  const txCoin = tx.coin ? BTC : tx.blockHeight ? ETH : FIAT;
  const unitMultiplier = txCoin === BTC ? BTC_PER_UNIT : ETH_PER_UNIT;

  const transformedData = {
    searchable: tx.searchable,
    state: tx.state,
    type: tx.type,
  };

  if (txCoin === FIAT) {
    const { from, to } = getFiatDests(tx);

    transformedData.amount = parseFloat(tx.fiatValue);
    transformedData.amountCrypto = getFiatConversion(tx, prices);
    transformedData.amountFiat = tx.fiatValue;
    transformedData.currency = tx.pair;
    transformedData.from = from;
    transformedData.time = formatISO(new Date(tx[CREATED_AT]));
    transformedData.to = to;
  } else {
    const amount = parseFloat((tx.amount * unitMultiplier).toFixed(8));

    transformedData.amountCrypto = amount;
    transformedData.amountFiat = parseFloat(
      (amount * prices[txCoin]).toFixed(2)
    );
    transformedData.currency = txCoin;
    transformedData.from = tx.from;
    transformedData.time = formatISO(fromUnixTime(tx[INSERTED_AT]));
    transformedData.to = tx.to;
  }

  return transformedData;
};

export const safeDescCompare = (a, b, orderBy) => {
  const valA = { ...a }[orderBy];
  const valB = { ...b }[orderBy];

  if (orderBy === "time") {
    return compareAsc(parseISO(valA), parseISO(valB));
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

export const makeSearchable = (data) => ({
  ...data,
  searchable: Object.values(data).join(" "),
});
