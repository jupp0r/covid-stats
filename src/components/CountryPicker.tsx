import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { LoadedState } from "../store";

import { createSelector } from "reselect";

import { includes } from "lodash/fp";
import {
  makeCountryToggleAction,
  makeCoutrySearchChangedAction,
} from "../actions";
import { IDataFrame } from "data-forge";

const dataSelector = (state: LoadedState) => state.data;
const pickedCountriesSelector = (state: LoadedState) =>
  state.ui.pickedCountries;
const searchTextSelector = (state: LoadedState) => state.ui.searchText;

const coutrySelector = createSelector(
  dataSelector,
  pickedCountriesSelector,
  searchTextSelector,
  (data: IDataFrame, pickedCountries: string[], searchText) =>
    data
      .select(
        ({ iso_code, location }: { iso_code: string; location: string }) => ({
          iso_code,
          location,
        }),
      )
      .distinct(row => row.iso_code)
      .orderBy(row => row.location)
      .toPairs()
      .map(([_, row]) => ({
        ...row,
        active: includes(row.iso_code)(pickedCountries),
      }))
      .filter(
        row =>
          row.active ||
          (searchText !== "" &&
            row.location.toLowerCase().startsWith(searchText.toLowerCase())),
      ),
);

export const CountryPicker = () => {
  const dispatch = useDispatch();

  const allCountries = useSelector(coutrySelector).map(
    ({ iso_code, location, active }) => (
      <li
        key={iso_code}
        onClick={_ => dispatch(makeCountryToggleAction(iso_code))}
      >
        <input type="checkbox" checked={active} />
        {location}
      </li>
    ),
  );

  const searchText = useSelector((state: LoadedState) => state.ui.searchText);

  const ulStyle = { listStyleType: "none", align: "left" };

  return (
    <div>
      <label>
        <h2>Select Countries</h2>
        <br />
        <input
          type="text"
          name="search"
          placeholder="Search Countries"
          onChange={e =>
            dispatch(makeCoutrySearchChangedAction(e.target.value))
          }
          value={searchText}
        />
        <ul id="countries" style={ulStyle}>
          {allCountries}
        </ul>
      </label>
    </div>
  );
};
