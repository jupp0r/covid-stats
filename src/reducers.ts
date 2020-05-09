import { initialState, State, LoadedState } from "./store";

import { Action } from "./actions";
import { transformCsvData } from "./data";

import { assertNever } from "./utils";

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
            return {
                ...state,
                ui:
                    { ...state.ui, pickedCountries: state.ui.pickedCountries }
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
