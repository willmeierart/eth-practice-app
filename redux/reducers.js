import { combineReducers } from "redux";
import * as types from "./types";
import { routes } from "../data/api";

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

const reducers = {
  data: dataReducer,
};

export default combineReducers(reducers);
