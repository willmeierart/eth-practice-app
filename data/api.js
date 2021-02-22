import fetch from "isomorphic-unfetch";

const BASE_URL = "http://localhost:8888/";

export const routes = [
  {
    endpoint: "btc-txs",
    name: "btc",
  },
  {
    endpoint: "custodial-txs",
    name: "custodial",
  },
  {
    endpoint: "eth-txs",
    name: "eth",
  },
  {
    endpoint: "prices",
    name: "prices",
  },
];

const compileFullPath = (route) => {
  const { endpoint } = routes.find((r) => r.name === route);
  return endpoint ? `${BASE_URL}${endpoint}` : null;
};

const api = {
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
