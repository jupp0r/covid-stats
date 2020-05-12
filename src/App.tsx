import React from "react";
import { useSelector } from "react-redux";
import "./App.css";
import "github-fork-ribbon-css/gh-fork-ribbon.css";

import Highcharts from "highcharts";
import GridTheme from "highcharts/themes/grid";

import { State } from "./store";

import { Loading } from "./Loading";
import { Loaded } from "./Loaded";
import { Error } from "./Error";

import { assertNever } from "./utils";

GridTheme(Highcharts);

export const App = () => {
  const state: State = useSelector<State, State>(_ => _);
  return (
    <>
      <a
        className="github-fork-ribbon right-top"
        href="https://github.com/jupp0r/covid-stats"
        data-ribbon="Fork me on GitHub"
        title="Fork me on GitHub"
      >
        Fork me on GitHub
      </a>
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
    </>
  );
};
