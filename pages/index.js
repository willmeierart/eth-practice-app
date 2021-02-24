// PACKAGES
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// REDUX
import { fetchAllData } from "../redux/actions";
// COMPONENTS
import DataTable from "../components/Table/DataTable";

/**
 * @Component
 * The homepage wrapper
 *
 */
const Home = () => {
  const dispatch = useDispatch();
  const {
    data: { filteredTransactions, loading },
  } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchAllData());
  }, [dispatch]);

  return (
    <div>
      <DataTable data={filteredTransactions} loading={loading} />
    </div>
  );
};

export default Home;
