import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { Provider, connect } from "react-redux";
import { State, store } from "./store";
import { bindActionCreators, Dispatch } from "redux";

import { Action } from "./actions";

const mapStateToProps = (store: State) => ({
  store,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return bindActionCreators({}, dispatch);
};

const connectToStore = connect(mapStateToProps, mapDispatchToProps);

const ConnectedComponent = connectToStore(App);

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <ConnectedComponent />
    </React.StrictMode>
  </Provider>,
  rootElement,
);
