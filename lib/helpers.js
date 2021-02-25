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

/**
 * @function
 * Parses and returns substring that is NOT the fiat value
 * @param {string} txPair formatted either like 'USD-ETH' or 'BTC-USD'
 *
 */
export const getCryptoFromFiat = (txPair) => {
  const coins = txPair.split("-");
  return coins[0] === USD ? coins[1] : coins[0];
};

/**
 * @function
 * Calculates and returns correct conversion multiplier for a fiat-crypto or crypto-fiat transaction
 * Note that this method is used BEFORE transactions are transformed and sanitized
 * @param {object} tx transaction data object
 * @param {object} prices price data fetched from mock api
 *
 */
export const getFiatConversion = (tx, prices) => {
  const crypto = getCryptoFromFiat(tx.pair);
  const conversion = prices[crypto];
  const convertedValue =
    tx.type === "buy" ? tx.fiatValue / conversion : tx.fiatValue * conversion;
  return parseFloat(convertedValue.toFixed(8));
};

/**
 * @function
 * Determines and returns correct `to` and `from` data for a transaction based on transaction coin and type
 * Note that this method is used BEFORE transactions are transformed and sanitized
 * @param {object} tx transaction data object
 *
 */
export const getFiatDests = (tx) => {
  const crypto = getCryptoFromFiat(tx.pair);
  const wallet = crypto === "ETH" ? ETH_WALLET : BTC_WALLET;
  return tx.type === "buy"
    ? { from: tx.id, to: wallet }
    : { from: wallet, to: tx.id };
};

/**
 * @function
 * Transforms a transaction of any type from the raw api response into uniform, table-consumable data
 * @param {object} tx transaction data object
 * @param {object} prices price data fetched from mock api
 *
 */
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
    transformedData.amountCrypto = getFiatConversion(tx, prices);
    transformedData.amountFiat = parseFloat(tx.fiatValue);
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

/**
 * @function
 * Sort method callback that handles special comparisons for ISO datetime strings
 * Defaults to descending order (processed by `getCompareFunc`)
 * @param {object} a first object in comparison
 * @param {object} b second object in comparison
 * @param {string} orderBy the property of the object use for comparisons
 *
 */
export const safeDescCompare = (a, b, orderBy) => {
  const valA = a[orderBy];
  const valB = b[orderBy];

  if (orderBy === "time") {
    return compareAsc(parseISO(valA), parseISO(valB));
  }

  if (valB < valA) return -1;
  if (valB > valA) return 1;
  return 0;
};

/**
 * @function
 * Determines whether to apply `safeDescCompare` callback by 'asc' or 'desc' order
 * @param {string} order either 'asc' or 'desc'
 * @param {string} orderBy the property of the object use for comparisons
 *
 */
export const getCompareFunc = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => safeDescCompare(a, b, orderBy)
    : (a, b) => -safeDescCompare(a, b, orderBy);
};

/**
 * @function
 * Custom sort method that determines whether to apply `safeDescCompare` callback by 'asc' or 'desc' order
 * @param {array} data array of transaction data objects
 * @param {function} compareFunc `getCompareFunc` invoked with relevant params
 *
 */
export const stableSort = (data, compareFunc) => {
  const stabilized = data.map((obj, i) => [obj, i]);
  stabilized.sort((a, b) => {
    // where index 0 represents the object itself and 1 is the index
    const order = compareFunc(a[0], b[0]);
    return order || a[1] - b[1];
  });
  // re-map sorted list to original format
  return stabilized.map((obj) => obj[0]);
};

/**
 * @function
 * Makeshift search helper that converts all data in an object into a single string that can be searched against
 * Returns original data object with searchable string property assigned to it
 * @param {object} tx individual transaction data object
 *
 */
export const makeSearchable = (tx) => ({
  ...tx,
  searchable: Object.values(tx).join(" "),
});

/**
 * @function
 * Filters transactions based on a searchphrase
 * Applied in both the search and (if applicable) filter reducers
 * @param {string} searchPhrase value of the controlled searchbar input
 * @param {array} txs array of transaction data objects to search
 *
 */
export const doSearch = (searchPhrase, txs) =>
  txs.filter((tx) =>
    tx.searchable.toLowerCase().includes(searchPhrase.toLowerCase())
  );

/**
 * @function
 * Filters transactions based on active filters
 * Applied in both the filter and (if applicable) search reducers
 * @param {object} filters all filters currently active in redux state
 * @param {array} txs array of transaction data objects to search
 *
 */
export const doFilter = (filters, txs) =>
  txs.filter((tx) => {
    let filteredOut = false;
    let filterCompareIdx = 0;
    const keyValPairs = Object.entries(filters);
    while (filteredOut === false && filterCompareIdx < keyValPairs.length) {
      const [fk, fv] = keyValPairs[filterCompareIdx];
      if (tx[fk] && !tx[fk].toLowerCase().includes(fv.toLowerCase())) {
        filteredOut = true;
      }
      filterCompareIdx++;
    }
    return !filteredOut;
  });

/**
 * @function
 * Used by the `DataTable` component to assign truncated values (and tooltips) to long cell values
 * Returns nothing if no special value necessary
 * @param {string} value the cell value to evaluate
 * @param {string} column the key to which the cell value pertains
 *
 */
export const getDisplayValue = (value, column) => {
  if (column === "time") {
    return value.split("T")[0];
  }
  if (column === "amountFiat") {
    return `$${value.toFixed(2)}`;
  }

  if (typeof value === "string" && value.length > 13) {
    return `${value.substring(0, 10)}...`;
  }
};
