// PACKAGES
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
// REDUX
import { fetchAllData } from "../redux/actions";
// COMPONENTS
import DataTable from "../components/Table/DataTable";

const Home = () => {
  const dispatch = useDispatch();
  const {
    data: { filteredTransactions, loading },
  } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchAllData());
  }, [dispatch]);

  const containerStyles = {
    alignItems: loading ? "center" : "flex-start",
    display: "flex",
    justifyContent: "center",
    minHeight: "100vh",
    minWidth: "100vw",
  };

  return (
    <div style={containerStyles}>
      {loading ? (
        <CircularProgress />
      ) : (
        <DataTable data={filteredTransactions} loading={loading} />
      )}
    </div>
  );
};

export default Home;
