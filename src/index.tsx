import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { Provider, connect } from "react-redux";
import { store } from "./store";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App store={store} />
    </React.StrictMode>
  </Provider>,
  rootElement,
);
