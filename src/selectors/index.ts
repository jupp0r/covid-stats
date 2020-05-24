import { IDataFrame } from "data-forge";
import { createSelector } from "reselect";

import { makeCountryColors } from "../components/countryColors";
import { LoadedState } from "../store";
import { Row } from "../store/data";

export const dataSelector = (state: LoadedState): IDataFrame<number, Row> => state.data;
export const pickedCountriesSelector = (state: LoadedState): string[] =>
  state.ui.pickedCountries;
export const colorMapSelector = createSelector(
  pickedCountriesSelector,
  makeCountryColors,
);

export const countryNameSelector = createSelector(
  dataSelector,
  (data: IDataFrame): Map<string, string> => {
    const kvPairs: [string, string][] = data
      .groupBy(row => row.isoCode)
      .select(group => ({
        code: group.first().isoCode,
        name: group.first().location,
      }))
      .toArray()
      .map(({ code, name }) => [code, name]);
    return new Map(
      kvPairs,
    );
  }
);
