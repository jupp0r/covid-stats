import React from "react";
import { useSelector } from "react-redux";
import "./App.css";
import "github-fork-ribbon-css/gh-fork-ribbon.css";

import { State } from "../store";

import { Loading } from "./Loading";
import { Loaded } from "./Loaded";
import { Error } from "./Error";

import { assertNever } from "../utils";
import "./highchartsTheme";

import Box from "@material-ui/core/Box";

export const App = () => {
  const type = useSelector<State, State["type"]>(state => state.type);

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
      <Box px={3} py={3} my={3} textAlign="center">
        {((type: State["type"]) => {
          switch (type) {
            case "loading":
              return <Loading />;
            case "loaded":
              return <Loaded />;
            case "error":
              return <Error />;
            default:
              return assertNever(type);
          }
        })(type)}
      </Box>
    </>
  );
};
