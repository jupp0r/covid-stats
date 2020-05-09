import React from "react";
import { useSelector } from "react-redux";
import "./App.css";

import { State } from "./store";

import { Loading } from "./Loading";
import { Loaded } from "./Loaded";
import { Error } from "./Error";

import { assertNever } from "./utils";

export const App = () => {
  const state: State = useSelector<State, State>(_ => _);
  return (
    <div className="App">
      {((state: State) => {
        switch (state.type) {
          case "loading":
            return <Loading />;
          case "loaded":
            return <Loaded />;
          case "error":
            return <Error />;
          default:
            return assertNever(state);
        }
      })(state)}
    </div>
  );
};
