import { CREATED_AT, INSERTED_AT } from "../lib/constants";
import { formatISO, fromUnixTime } from "date-fns/fp";

const getChronVal = (item) =>
  item
    ? item[CREATED_AT]
      ? formatISO(new Date(item[CREATED_AT]))
      : formatISO(fromUnixTime(item[INSERTED_AT]))
    : 0;

export const sortTransactions = (data, sortBy) => {
  return data.sort((a, b) => {
    switch (sortBy) {
      default:
        // default to TIME_DESC (most to least recent)
        return getChronVal(a) - getChronVal(b);
    }
  });
};
