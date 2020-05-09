import { initialState, State, LoadedState } from "./store";

import { Action } from "./actions";
import { transformCsvData } from "./data";

import { assertNever } from "./utils";

import { includes } from 'lodash/fp';

const errorReducer = (state: State, action: Action): State => state;

const loadingReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "fetch-success":
            return {
                type: "loaded",
                data: transformCsvData(action.response),
                ui: {
                    pickedCountries: ["USA"],
                },
            };
        default:
            return state;
    }
};

const loadedReducer = (state: LoadedState, action: Action): State => {
    switch (action.type) {
        case "country-selected":
             const maybeAddCountryToPicked = (
               country: string,
               countries: string[],
             ): string[] => {
               if (includes(country)(countries)) {
                 return countries;
               }

               return [country, ...countries];
             };
            
            return {
                ...state,
                ui:
                {
                    ...state.ui,
                    pickedCountries:
                        maybeAddCountryToPicked(action.countryCode, state.ui.pickedCountries),
                }
            };
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
