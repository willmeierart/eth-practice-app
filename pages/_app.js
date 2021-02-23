import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { useStore } from "../redux/store";

const App = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

App.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};

export default App;
