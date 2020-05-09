import React, { CSSProperties } from "react";
import { useSelector, useDispatch } from "react-redux";

import { LoadedState } from "./store";

import { includes } from "lodash/fp";
import { makeCountrySelectedAction } from "./actions";

const allCoutrySelector = (state: LoadedState) =>
  state.data
    .select(
      ({ iso_code, location }: { iso_code: string; location: string }) => ({
        iso_code,
        location,
      }),
    )
    .distinct(row => row.iso_code)
    .toPairs()
    .map(([_, row]) => ({
      ...row,
      active: includes(row.iso_code)(state.ui.pickedCountries),
    }));

export const CountryPicker = () => {
  const dispatch = useDispatch();

  const boldIfSelected = (selected: boolean): CSSProperties => ({
    fontWeight: selected ? "bold" : "normal",
  });

  const allCountries = useSelector(allCoutrySelector).map(
    ({ iso_code, location, active }) => (
      <li
        key={iso_code}
        style={boldIfSelected(active)}
        onClick={_ => dispatch(makeCountrySelectedAction(iso_code))}
      >
        {location}
      </li>
    ),
  );
  return (
    <div>
      <label>
        Country Picker
        <ul id="countries">{allCountries}</ul>
      </label>
    </div>
  );
};
