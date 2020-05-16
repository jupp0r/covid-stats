import { initialState, State, LoadedState, LoadingState } from "../store";

import { Action } from "../actions";
import { transformCsvData } from "../store/data";

import { assertNever } from "../utils";

import { includes, filter } from "lodash/fp";

import { getPickedCountriesFromUrl, updateCountriesInPathName } from "./router";

const errorReducer = (state: State, action: Action): State => state;

const loadingReducer = (state: LoadingState, action: Action): State => {
  switch (action.type) {
    case "fetch-success":
      const pickedCountries = getPickedCountriesFromUrl(state.routing.url);
      return {
        ...state,
        type: "loaded",
        data: transformCsvData(action.response),
        ui: {
          pickedCountries,
          searchText: "",
          caseChart: {
            logSetting: "logarithmic",
          },
          dataTable: {
            dateToDisplay: "yesterday",
          },
        },
        routing: {
          url: updateCountriesInPathName(state.routing.url, pickedCountries),
        },
      };
    case "progress":
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.target]: {
            done: action.done,
            total: Math.max(state.progress[action.target].total, action.done),
            ...(action.total !== 0 && {
              total: Math.max(action.total, action.done),
            }),
          },
        },
      };
    default:
      return state;
  }
};

const loadedReducer = (state: LoadedState, action: Action): State => {
  switch (action.type) {
    case "country-toggled":
      const toggleCountryToPicked = (
        country: string,
        countries: string[],
      ): string[] => {
        if (includes(country)(countries)) {
          return filter(c => c !== country, countries);
        }

        return [country, ...countries];
      };

      const newCountries = toggleCountryToPicked(
        action.countryCode,
        state.ui.pickedCountries,
      );

      return {
        ...state,
        ui: {
          ...state.ui,
          pickedCountries: newCountries,
        },
        routing: {
          url: updateCountriesInPathName(state.routing.url, newCountries),
        },
      };
    case "country-search-changed":
      return { ...state, ui: { ...state.ui, searchText: action.search } };
    case "case-chart-log-setting-changed":
      return {
        ...state,
        ui: {
          ...state.ui,
          caseChart: { ...state.ui.caseChart, logSetting: action.newSetting },
        },
      };
    case "data-table-date-selection-changed":
      return {
        ...state,
        ui: {
          ...state.ui,
          dataTable: {
            ...state.ui.dataTable,
            dateToDisplay: action.newSetting,
          },
        },
      };
    default:
      return state;
  }
};

export const reducer = (state: State = initialState, action: Action): State => {
  if (action.type === "url-updated") {
    return { ...state, routing: { ...state.routing, url: action.url } };
  }

  switch (state.type) {
    case "error":
      return errorReducer(state, action);
    case "loading":
      return loadingReducer(state, action);
    case "loaded":
      return loadedReducer(state, action);
    default:
      return assertNever(state);
  }
};
