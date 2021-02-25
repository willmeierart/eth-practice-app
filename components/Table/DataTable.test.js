import React from "react";
import { useSelector } from "react-redux";
import { mount } from "enzyme";
import TestProvider, { mockStore } from "../../test/TestProvider";
import { mockTransformedTxs } from "../../test/data";
import DataTable from "./DataTable";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn((callback) => callback(mockStore)),
}));

describe("DataTable", () => {
  let container;
  const Wrapper = () => (
    <TestProvider>
      <DataTable data={mockTransformedTxs} />
    </TestProvider>
  );

  beforeEach(() => {
    container = mount(<Wrapper />);
  });

  afterEach(() => {
    container.unmount();
  });

  it("mounts", () => {
    expect(container.find("DataTable").exists()).toBe(true);
    expect(container.find("ForwardRef(TableBody)").exists()).toBe(true);
  });

  it("renders a loader when loading", () => {
    const loadingStore = {
      ...mockStore,
      data: { ...mockStore.data, loading: true },
    };
    useSelector.mockImplementationOnce((callback) => callback(loadingStore));
    container = mount(<Wrapper />);
    expect(container.find("ForwardRef(TableBody)").exists()).toBe(false);
    expect(container.find("div.loading-wrapper").exists()).toBe(true);
  });

  it("renders a TableRow for each transaction, and one for the header", () => {
    expect(container.find("ForwardRef(TableRow)").length).toBe(
      mockStore.data.filteredTransactions.length + 1
    );
  });
});
