import {
  doFilter,
  doSearch,
  getCompareFunc,
  getCryptoFromFiat,
  getDisplayValue,
  getFiatConversion,
  getFiatDests,
  makeSearchable,
  safeDescCompare,
  stableSort,
  transformTransactionData,
} from "./helpers";
import { ETH_WALLET, FILTERS } from "./constants";
import { mockTxs, mockTransformedTxs } from "../test/data";

describe("doFilter", () => {
  it("correctly filters transactions based on their values", () => {
    const filters = { [FILTERS[0].id]: "USD" };
    const result = doFilter(filters, mockTransformedTxs);
    expect(result.length).toBe(1);
  });
});

describe("doSearch", () => {
  it("correctly filters based on common phrases", () => {
    const result = doSearch("a", mockTransformedTxs);
    expect(result.length).toBe(mockTransformedTxs.length);
  });
  it("correctly filters based on specific phrases", () => {
    const result = doSearch("btc", mockTransformedTxs);
    expect(result.length).toBe(1);
  });
  it("correctly filters based on irrelevant phrases", () => {
    const result = doSearch("xyz", mockTransformedTxs);
    expect(result.length).toBe(0);
  });
});

describe("getCompareFunc", () => {
  it("returns items in descending order if order is descending", () => {
    const mockArr = [{ test: 1 }, { test: 2 }, { test: 3 }];
    const compareFunc = getCompareFunc("desc", "test");
    mockArr.sort(compareFunc);
    expect(mockArr[0].test).toBe(3);
    expect(mockArr[2].test).toBe(1);
  });
  it("returns items in ascending order if order is ascending", () => {
    const mockArr = [{ test: 3 }, { test: 2 }, { test: 1 }];
    const compareFunc = getCompareFunc("desc", "test");
    mockArr.sort(compareFunc);
    expect(mockArr[0].test).toBe(3);
    expect(mockArr[2].test).toBe(1);
  });
});

describe("getCryptoFromFiat", () => {
  it("parses transactions from eth to usd", () => {
    const result = getCryptoFromFiat("ETH-USD");
    expect(result).toBe("ETH");
  });
  it("parses transactions from usd to eth", () => {
    const result = getCryptoFromFiat("USD-ETH");
    expect(result).toBe("ETH");
  });
  it("parses transactions from btc to usd", () => {
    const result = getCryptoFromFiat("BTC-USD");
    expect(result).toBe("BTC");
  });
  it("parses transactions from usd to btc", () => {
    const result = getCryptoFromFiat("USD-BTC");
    expect(result).toBe("BTC");
  });
});

describe("getDisplayValue", () => {
  it("returns no display value if inapplicable", () => {
    const testVal = "test";
    const result = getDisplayValue(testVal, "test");
    expect(testVal.length).toBeLessThan(13);
    expect(result).toBe(undefined);
  });
  it("returns truncateddisplay value for long string", () => {
    const testVal = "test56789101112";
    const result = getDisplayValue(testVal, "test");
    expect(testVal.length).toBeGreaterThan(13);
    expect(result).toBe(`${testVal.substring(0, 10)}...`);
  });
  it("returns split value for times", () => {
    const testVal = "2021-02-25T00:00:00";
    const result = getDisplayValue(testVal, "time");
    expect(result).toBe("2021-02-25");
  });
  it("correct fiat numerical values", () => {
    const testVal = 1000.1;
    const result = getDisplayValue(testVal, "amountFiat");
    expect(result).toBe("$1000.10");
  });
});

describe("getFiatConversion", () => {
  it("converts to crypto in a fiat purchase", () => {
    const { prices, transactions } = { ...mockTxs };
    const fiatTx = transactions[1];
    fiatTx.type = "buy";
    const convertedPrice = getFiatConversion(fiatTx, prices);
    expect(parseFloat(fiatTx.fiatValue)).toBeGreaterThan(convertedPrice);
  });
  it("converts to crypto in a fiat sale", () => {
    const { prices, transactions } = { ...mockTxs };
    const fiatTx = transactions[1];
    fiatTx.type = "sell";
    const convertedPrice = getFiatConversion(fiatTx, prices);
    expect(parseFloat(fiatTx.fiatValue)).toBeLessThan(convertedPrice);
  });
});

describe("getFiatDests", () => {
  it("returns correct to/from values for a fiat purchase", () => {
    const { transactions } = { ...mockTxs };
    const fiatTx = transactions[1];
    fiatTx.type = "buy";
    const { from, to } = getFiatDests(fiatTx);
    expect(from).toBe(fiatTx.id);
    expect(to).toBe(ETH_WALLET);
  });
  it("returns correct to/from values for a fiat sale", () => {
    const { transactions } = { ...mockTxs };
    const fiatTx = transactions[1];
    fiatTx.type = "sell";
    const { from, to } = getFiatDests(fiatTx);
    expect(from).toBe(ETH_WALLET);
    expect(to).toBe(fiatTx.id);
  });
});

describe("makeSearchable", () => {
  it("adds a searchable attribute to a transaction", () => {
    const { transactions } = { ...mockTxs };
    const tx = transactions[1];
    delete tx.searchable;
    expect(typeof tx.searchable).toBe("undefined");
    const searchableTx = makeSearchable(tx);
    expect(typeof searchableTx.searchable).toBe("string");
    expect(searchableTx.searchable.includes(tx.id)).toBe(true);
  });
});

describe("safeDescCompare", () => {
  it("returns correct positive value", () => {
    expect(safeDescCompare({ test: 1 }, { test: 2 }, "test")).toBe(1);
  });
  it("returns correct negative value", () => {
    expect(safeDescCompare({ test: 2 }, { test: 1 }, "test")).toBe(-1);
  });
  it("returns correct equal value", () => {
    expect(safeDescCompare({ test: 2 }, { test: 2 }, "test")).toBe(0);
  });
  it("handles times", () => {
    const isoTime1 = "2020-12-05T14:10:44.131Z";
    const isoTime2 = "2019-12-05T16:36:30.918Z";
    const timeComparison = safeDescCompare(
      { time: isoTime1 },
      { time: isoTime2 },
      "time"
    );
    expect(timeComparison).toBe(-1);
  });
});

describe("stableSort", () => {
  it("sorts correctly", () => {
    const testArr = [1, 2, 3];
    const expected = [3, 2, 1];
    const mockCompare = () => -1;
    expect(stableSort(testArr, mockCompare)).toEqual(expected);
  });
});

describe("transformTransactionData", () => {
  it("transforms data correctly", () => {
    const { prices, transactions } = mockTxs;
    expect(transformTransactionData(transactions[0], prices)).toEqual(
      mockTransformedTxs[0]
    );
  });
});
