import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllData } from "../redux/actions";

const Home = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchAllData());
  }, [dispatch]);

  return <div>x</div>;
};

export default Home;
