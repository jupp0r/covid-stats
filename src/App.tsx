import React from "react";
import { connect } from "react-redux";
import { makeInitialized } from "./actions";
import "./App.css";

import { State, ErrorState, LoadedState } from "./store";

import { Loading } from "./Loading";
import { Loaded } from "./Loaded";
import { Error } from "./Error";

import { assertNever } from "./utils";

function App(props: { store: State }) {
  return (
    <div className="App">
      {((store: State) => {
        switch (store.type) {
          case "loading":
            return <Loading />;
          case "loaded":
            return <Loaded store={props.store as LoadedState} />;
          case "error":
            return <Error store={props.store as ErrorState} />;
          default:
            return assertNever(store);
        }
      })(props.store)}
    </div>
  );
}

export default connect((state: State): State => state, { makeInitialized })(
  App,
);
