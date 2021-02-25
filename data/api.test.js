import fetch from "isomorphic-unfetch";
import api, { bsRouteWarning, compileFullPath, routes } from "./api";
import { BASE_URL } from "../lib/constants";

jest.mock("isomorphic-unfetch");

const warn = { ...global.console.warn };
const data = {};

describe("api", () => {
  beforeAll(() => {
    global.console.warn = jest.fn();
  });

  afterAll(() => {
    global.console.warn = warn;
  });

  it("successfully compiles a full path name", () => {
    const { endpoint, name: route } = routes[0];
    expect(compileFullPath(route)).toBe(`${BASE_URL}${endpoint}`);
  });

  it("handles a successful fetch", async () => {
    fetch.mockImplementation(() => Promise.resolve(data));
    const response = await api.fetch(routes[0].name);
    expect(response).toEqual(data);
  });

  it("handles a fetch to a bs endpoint", async () => {
    const response = await api.fetch("bs-route");
    expect(global.console.warn).toHaveBeenCalledWith(
      bsRouteWarning("bs-route")
    );
    expect(response).toEqual([]);
  });

  it("handles a failed fetch", async () => {
    fetch.mockImplementation(() => Promise.reject(new Error({})));
    const route = routes[0].name;
    const response = await api.fetch(route);
    expect(global.console.warn).toHaveBeenCalledWith(
      `Failed to fetch ${compileFullPath(route)}.`
    );
    expect(response).toEqual([]);
  });
});
