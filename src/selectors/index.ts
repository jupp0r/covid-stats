import { LoadedState } from "../store";

import { createSelector } from "reselect";
import { makeCountryColors } from "../components/countryColors";

export const dataSelector = (state: LoadedState) => state.data;
export const pickedCountriesSelector = (state: LoadedState) => state.ui.pickedCountries;
export const colorMapSelector = createSelector(pickedCountriesSelector, makeCountryColors);