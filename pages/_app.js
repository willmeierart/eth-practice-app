// PACKAGES
import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
// REDUX
import { useStore } from "../redux/store";

/**
 * @Component
 * The base app override for next applications
 * Allows for global wrappers that persist across route changes
 * @param {object: { Component }} Component standard next.js pattern (Page Component)
 * @param {object: { object }} pageProps standard next.js pattern (Page props)
 *
 */
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
