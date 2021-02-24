import { combineReducers } from "redux";
import * as types from "./types";

const initialFilterState = {
  filteredTransactions: [],
  filters: {},
  searchPhrase: "",
};

const initialDataState = {
  ...initialFilterState,
  loading: true,
  prices: {},
  transactions: [],
};

const dataReducer = (state = initialDataState, action) => {
  // console.log(action);
  switch (action.type) {
    case types.FETCH_ALL:
      return { ...state, ...action.payload };
    case types.SEARCH:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const initialOrderState = {
  order: "desc",
  orderBy: "time",
};

const orderReducer = (state = initialOrderState, action) => {
  switch (action.type) {
    case types.REORDER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const reducers = {
  data: dataReducer,
  order: orderReducer,
};

export default combineReducers(reducers);
