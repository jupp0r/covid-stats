import { configureStore } from "@reduxjs/toolkit";
import { IDataFrame } from "data-forge";
import { Store as ReduxStore } from "redux";
import { createEpicMiddleware } from "redux-observable";

import { makeInitialized } from "../actions";
import { Action } from "../actions";
import { rootEpic } from "../epics";
import { reducer } from "../reducers/reducers";
import { setupRouting } from "../reducers/router";
import { Row } from "./data";

export type State = (LoadingState | LoadedState | ErrorState);
interface RoutingState {
  routing: {
    url: string;
  };
}

interface Progress {
  done: number;
  total: number;
}
export type LoadingState = {
  type: "loading";
  progress: {
    covid: Progress;
    population: Progress;
    us: Progress;
    stateInfo: Progress;
  };
} & RoutingState;

export type UIState = {
  pickedCountries: string[];
  searchText: string;
  caseChart: {
    logSetting: "linear" | "logarithmic";
    syncAxes: boolean;
  };
  dataTable: {
    dateToDisplay: "today" | "yesterday";
  };
}

export type LoadedState = {
  type: "loaded";
  data: IDataFrame<number, Row>;
  ui: UIState;
} & RoutingState

export type ErrorState = {
  type: "error";
  message: string;
} & RoutingState;

/// approximate download sizes for the progress bar in case servers don't send Content-Length
const covidSizeEstimate = 2459742;
const populationSizeEstimate = 487991;
const usDataEstimate = 679331;
const stateInfoEstimate = 30102;

export const initialState: State = {
  type: "loading",
  progress: {
    covid: { done: 0, total: covidSizeEstimate },
    population: { done: 0, total: populationSizeEstimate },
    us: { done: 0, total: usDataEstimate },
    stateInfo: { done: 0, total: stateInfoEstimate },
  },
  routing: {
    url: window.location.toString(),
  }
};

export const defaultCountries = [
         "AZ",
         "CA",
         "FL",
         "OK",
         "TX",
         "USA",
         "DEU",
         "SWE",
         "NGA",
         "RUS",
         "BRA",
       ];

export type Store = ReduxStore<State, Action>;

const epicMiddleware = createEpicMiddleware();
export const store = configureStore({
  reducer,
  middleware: [epicMiddleware],
});
epicMiddleware.run(rootEpic);

setupRouting(store);
store.dispatch(makeInitialized());
