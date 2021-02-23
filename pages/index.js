// PACKAGES
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// REDUX
import { fetchAllData } from "../redux/actions";
// COMPONENTS
import DataTable from "../components/Table/DataTable";

const Home = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchAllData());
  }, [dispatch]);

  return data?.transactions ? (
    <div>
      <DataTable data={data.transactions} />
    </div>
  ) : null;
};

export default Home;
