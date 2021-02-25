import debounce from "lodash.debounce";
import {
  fetchAllData,
  filterTransactions,
  reorderData,
  setLoading,
  searchTransactions,
} from "./actions";
import * as types from "./types";
import { makeSearchable } from "../lib/helpers";
import api from "../data/api";
import { mockTxs, mockTransformedTxs } from "../test/data";

jest.mock("../data/api", () => ({
  ...jest.requireActual("../data/api"),
  fetch: jest.fn(),
}));
jest.mock("../lib/helpers", () => ({
  doFilter: jest.fn((x) => mockTransformedTxs),
  doSearch: jest.fn((x) => mockTransformedTxs),
  makeSearchable: jest.fn((x) => x),
  transformTransactionData: jest.fn((x) => x),
}));
jest.mock("lodash.debounce");

let dispatch = jest.fn();

describe("fetchAllData", () => {
  it("fetches and transforms all data", async () => {
    const searchables = mockTxs.transactions.map(
      (tx) => makeSearchable(tx).searchable
    );
    const searchableMock = mockTransformedTxs.map((tx, i) => ({
      ...tx,
      searchable: searchables[i],
    }));

    api.fetch.mockImplementationOnce(() => ({
      json: () => mockTxs.transactions[0],
    }));
    api.fetch.mockImplementationOnce(() => ({
      json: () => mockTxs.transactions[1],
    }));
    api.fetch.mockImplementationOnce(() => ({
      json: () => mockTxs.transactions[2],
    }));
    api.fetch.mockImplementationOnce(() => ({ json: () => mockTxs.prices }));
    await fetchAllData()(dispatch);

    expect(dispatch).toHaveBeenLastCalledWith({
      payload: {
        filteredTransactions: searchableMock,
        loading: false,
        prices: makeSearchable(mockTxs.prices),
        transactions: searchableMock,
      },
      type: types.FETCH_ALL,
    });
  });
});

describe("filterTransactions", () => {
  beforeEach(() => {
    dispatch = jest.fn();
  });

  it("sets loading to true", () => {
    filterTransactions({ x: "y" }, {}, [])(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      payload: true,
      type: types.SET_LOADING,
    });
  });

  it("deletes a property when it is reset", () => {
    filterTransactions(
      { filter: "Filter" },
      { extra: "persists", filter: "true" },
      mockTransformedTxs
    )(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      payload: {
        activeFilters: { extra: "persists" },
        filteredTransactions: mockTransformedTxs,
      },
      type: types.FILTER,
    });
  });

  it("adds a filter when new", () => {
    filterTransactions(
      { filter: "true" },
      { extra: "persists" },
      mockTransformedTxs
    )(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      payload: {
        activeFilters: { extra: "persists", filter: "true" },
        filteredTransactions: mockTransformedTxs,
      },
      type: types.FILTER,
    });
  });
});

describe("reorderData", () => {
  it("makes a call to dispatch order data", () => {
    reorderData("asc", "prop")(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      payload: { order: "asc", orderBy: "prop" },
      type: types.REORDER,
    });
  });

  describe("setLoading", () => {
    beforeEach(() => {
      dispatch = jest.fn();
    });

    it("defaults to loading true when calling dispatch", () => {
      setLoading()(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        payload: true,
        type: types.SET_LOADING,
      });
    });

    it("sets loading to a specific value when calling dispatch", () => {
      setLoading(false)(dispatch);

      expect(dispatch).toHaveBeenCalledWith({
        payload: false,
        type: types.SET_LOADING,
      });
    });
  });

  describe("searchTransactions", () => {
    it("first calls search dispatch with loading: true, then calls debounced with loading: false", () => {
      debounce.mockImplementation((cb) => cb);

      searchTransactions("test", mockTransformedTxs)(dispatch);

      expect(dispatch).toHaveBeenNthCalledWith(1, {
        payload: {
          filteredTransactions: mockTransformedTxs,
          loading: true,
          searchPhrase: "test",
        },
        type: types.SEARCH,
      });

      expect(dispatch).toHaveBeenNthCalledWith(2, {
        payload: {
          filteredTransactions: mockTransformedTxs,
          loading: false,
          searchPhrase: "test",
        },

        type: types.SEARCH,
      });
    });
  });
});
