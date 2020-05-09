import { configureStore } from "@reduxjs/toolkit";
import { reducer } from "./reducers";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "./epics";
import { makeInitialized } from "./actions";
import { IDataFrame } from "data-forge";
import { Store as ReduxStore } from "redux";
import { Action } from "./actions";

export type State = LoadingState | LoadedState | ErrorState;

interface Progress {
  done: number;
  total: number;
}
export interface LoadingState {
  type: "loading";
  progress: {
    covid: Progress;
    population: Progress;
  };
}

export interface UIState {
  pickedCountries: string[];
  searchText: string;
}

export interface LoadedState {
  type: "loaded";
  data: IDataFrame;
  ui: UIState;
}

export interface ErrorState {
  type: "error";
  message: string;
}

const covidSizeEstimate = 2542856;
const populationSizeEstimate = 487991;

export const initialState: State = {
  type: "loading",
  progress: {
    covid: { done: 0, total: covidSizeEstimate },
    population: { done: 0, total: populationSizeEstimate },
  },
};

export type Store = ReduxStore<State, Action>;

const epicMiddleware = createEpicMiddleware();
export const store = configureStore({
  reducer,
  middleware: [epicMiddleware],
});
epicMiddleware.run(rootEpic);

store.dispatch(makeInitialized());
