import "./index.css";
import "typeface-roboto";

import { createMuiTheme, CssBaseline,ThemeProvider } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { App } from "./components/App";
import { store } from "./store";

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
