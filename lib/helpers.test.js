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
import { BTC_WALLET, ETH_WALLET, FILTERS } from "./constants";
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
    const result = doSearch("phrase", mockTransformedTxs);
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
  it("", () => {});
});

describe("makeSearchable", () => {
  it("", () => {});
});

describe("safeDescCompare", () => {
  it("", () => {});
});

describe("stableSort", () => {
  it("", () => {});
});

describe("transformTransactionData", () => {
  it("", () => {});
});
