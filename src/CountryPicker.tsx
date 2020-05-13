import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { LoadedState } from "./store";

import { includes } from "lodash/fp";
import {
  makeCountryToggleAction,
  makeCoutrySearchChangedAction,
} from "./actions";

const coutrySelector = (state: LoadedState) =>
  state.data
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
      active: includes(row.iso_code)(state.ui.pickedCountries),
    }))
    .filter(
      row =>
        row.active ||
        (state.ui.searchText !== "" &&
          row.location
            .toLowerCase()
            .startsWith(state.ui.searchText.toLowerCase())),
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
