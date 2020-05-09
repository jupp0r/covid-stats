import { initialState, State, LoadedState } from "./store";

import { Action } from "./actions";
import { transformCsvData } from "./data";

import { assertNever } from "./utils";

import { includes, filter } from 'lodash/fp';

const errorReducer = (state: State, action: Action): State => state;

const loadingReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "fetch-success":
            return {
                type: "loaded",
                data: transformCsvData(action.response),
                ui: {
                    pickedCountries: ["USA"],
                    searchText: "",
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
            
            return {
              ...state,
              ui: {
                ...state.ui,
                pickedCountries: toggleCountryToPicked(
                  action.countryCode,
                  state.ui.pickedCountries,
                ),
              },
            };
        case "country-search-changed":
            return { ...state, ui: { ...state.ui, searchText: action.search } };
        default:
            return state;
    }
};

export const reducer = (state: State = initialState, action: Action): State => {
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
