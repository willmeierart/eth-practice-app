import { combineReducers } from "redux";
import * as types from "./types";
import { routes } from "../data/api";

const initialData = routes.reduce((acc, { name }) => {
  acc[name] = [];
  return acc;
}, {});

export const initialState = {
  data: initialData,
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_ALL:
      return { ...initialState, ...action.payload };
    default:
      return state;
  }
};

const reducers = {
  data: dataReducer,
};

export default combineReducers(reducers);
