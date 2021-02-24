// PACKAGES
import fetch from "isomorphic-unfetch";
// CONSTANTS
import { BASE_URL } from "../lib/constants";

export const routes = [
  {
    endpoint: "btc-txs",
    name: "btc",
    tx: true,
  },
  {
    endpoint: "custodial-txs",
    name: "custodial",
    tx: true,
  },
  {
    endpoint: "eth-txs",
    name: "eth",
    tx: true,
  },
  {
    endpoint: "prices",
    name: "prices",
    // used in `fetchAllData` action to treat this route differently
    tx: false,
  },
];

/**
 * @function
 * Constructs path for api query
 * @param {object} route one of the above routes
 *
 */
const compileFullPath = (route) => {
  const { endpoint } = routes.find((r) => r.name === route);
  return endpoint ? `${BASE_URL}${endpoint}` : null;
};

const api = {
  /**
   * @function
   * Fetches data from mock api
   * @param {object} route one of the above routes
   *
   */
  fetch: async (route) => {
    const path = compileFullPath(route);

    if (path) {
      try {
        const data = await fetch(path);
        return data;
      } catch (e) {
        console.warn(`Failed to fetch ${path}.`);
        return [];
      }
    } else {
      const routeNames = routes.map((r) => r.name).join(", ");
      console.warn(
        `Invalid route key provided (${route}). Please try one of the following: ${routeNames}`
      );
      return [];
    }
  },
};

export default api;
