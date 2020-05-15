import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./components/App";

import { Provider } from "react-redux";
import { store } from "./store";
import { createMuiTheme, ThemeProvider, CssBaseline } from "@material-ui/core";

import "typeface-roboto";

const rootElement = document.getElementById("root");

const darkTheme = createMuiTheme({
  palette: {
    type: "light",
  },
});

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  </Provider>,
  rootElement,
);
