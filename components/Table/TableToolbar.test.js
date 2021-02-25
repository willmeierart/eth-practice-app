import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import TestProvider, { mockStore } from "../../test/TestProvider";
import TableToolbar from "./TableToolbar";
import { useStyles } from "./DataTable";
import { FILTERS } from "../../lib/constants";
import { filterTransactions, searchTransactions } from "../../redux/actions";

jest.mock("../../redux/actions", () => ({
  filterTransactions: jest.fn(),
  searchTransactions: jest.fn(),
}));
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn((callback) => callback(mockStore)),
}));

describe("TableToolbar", () => {
  let container;
  const Wrapper = () => {
    const classes = useStyles();
    return (
      <TestProvider>
        <TableToolbar classes={classes} />
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
    expect(container.find("TableToolbar").exists()).toBe(true);
    expect(container.find("ForwardRef(Toolbar)").exists()).toBe(true);
  });

  it("correctly calls dispatch to search transactions", () => {
    container
      .find("ForwardRef(TextField)")
      .first()
      .props()
      .onChange({
        target: { value: "searchPhrase" },
      });
    expect(searchTransactions).toHaveBeenCalledWith(
      "searchPhrase",
      mockStore.data.filteredTransactions
    );
  });

  it("correctly calls dispatch to filter transactions", () => {
    act(() => {
      container.find("ForwardRef(IconButton)").props().onClick();
    });
    container.update();
    container
      .find("ForwardRef(Select)")
      .first()
      .props()
      .onChange({
        target: { value: "test option" },
      });
    expect(filterTransactions).toHaveBeenCalledWith(
      { [FILTERS[0].id]: "test option" },
      {},
      mockStore.data.filteredTransactions
    );
  });
});
