// PACKAGES
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
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

  useEffect(() => {
    dispatch(fetchAllData());
  }, [dispatch]);

  return (
    <div>
      <DataTable />
    </div>
  );
};

export default Home;
