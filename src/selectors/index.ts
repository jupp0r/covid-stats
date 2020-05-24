import { IDataFrame } from "data-forge";

import { LoadedState } from "../store";

import { createSelector } from "reselect";
import { makeCountryColors } from "../components/countryColors";

export const dataSelector = (state: LoadedState) => state.data;
export const pickedCountriesSelector = (state: LoadedState) =>
  state.ui.pickedCountries;
export const colorMapSelector = createSelector(
  pickedCountriesSelector,
  makeCountryColors,
);

export const countryNameSelector = createSelector(
  dataSelector,
  (data: IDataFrame): Map<string, string> => {
    const kvPairs: [string, string][] = data
      .groupBy(row => row.iso_code)
      .select(group => ({
        code: group.first().iso_code,
        name: group.first().location,
      }))
      .toArray()
      .map(({ code, name }) => [code, name]);
    return new Map(
      kvPairs,
    );
  }
);
