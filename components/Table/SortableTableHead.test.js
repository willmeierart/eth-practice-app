import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mount } from "enzyme";
import TestProvider, { mockStore } from "../../test/TestProvider";
import SortableTableHead from "./SortableTableHead";
import { useStyles } from "./DataTable";
import { HEAD_CELLS } from "../../lib/constants";
import { reorderData } from "../../redux/actions";

jest.mock("../../redux/actions", () => ({
  reorderData: jest.fn(),
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn((callback) => callback(mockStore)),
}));

describe("SortableTableHead", () => {
  let container;
  const Wrapper = () => {
    const classes = useStyles();
    return (
      <TestProvider>
        <table>
          <SortableTableHead classes={classes} />
        </table>
      </TestProvider>
    );
  };

  beforeEach(() => {
    container = mount(<Wrapper />);
  });

  afterEach(() => {
    container.unmount();
  });

  it("mounts", () => {
    expect(container.find("SortableTableHead").exists()).toBe(true);
    expect(container.find("ForwardRef(TableHead)").exists()).toBe(true);
  });

  it("renders a TableCell for each HEAD_CELL", () => {
    expect(container.find("ForwardRef(TableCell)").length).toBe(
      HEAD_CELLS.length
    );
  });

  it("correctly calls the dispatch to filter data", () => {
    container.find("ForwardRef(TableSortLabel)").first().simulate("click");
    expect(reorderData).toHaveBeenCalledWith("asc", HEAD_CELLS[0].id);
  });
});
