import React from "react";
import { Provider } from "react-redux";
import PropTypes from "prop-types";
import { useStore } from "../redux/store";
import { mockTxs, mockTransformedTxs } from "./data";

export const mockStore = {
  data: {
    activeFilters: {},
    filteredTransactions: mockTransformedTxs,
    loading: false,
    prices: mockTxs.prices,
    searchPhrase: "",
    transactions: mockTransformedTxs,
  },
  order: {
    order: "desc",
    orderBy: "time",
  },
};

const TestProvider = ({ children, storeOverride }) => {
  const store = useStore(mockStore);
  return <Provider store={{ ...store, ...storeOverride }}>{children}</Provider>;
};

TestProvider.propTypes = {
  children: PropTypes.any,
  storeOverride: PropTypes.object,
};

export default TestProvider;
