import { combineReducers } from "redux";
import * as types from "./types";

const initialDataState = {
  prices: {},
  transactions: {},
};

const dataReducer = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_ALL:
      return { ...initialDataState, ...action.payload };
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
      return { ...initialDataState, ...action.payload };
    default:
      return state;
  }
};

const reducers = {
  data: dataReducer,
  order: orderReducer,
};

export default combineReducers(reducers);
