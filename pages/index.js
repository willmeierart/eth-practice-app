import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllData } from "../redux/actions";
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
