// PACKAGES
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
// REDUX
import { fetchAllData } from "../redux/actions";
// COMPONENTS
import DataTable from "../components/Table/DataTable";

const containerStyles = {
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  minHeight: "100vh",
  minWidth: "100vw",
};

const Home = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchAllData());
  }, [dispatch]);

  return (
    <div style={containerStyles}>
      {data?.transactions ? (
        <DataTable data={data.transactions} />
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default Home;
