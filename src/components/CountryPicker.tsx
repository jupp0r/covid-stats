import React, { CSSProperties } from "react";
import { useSelector, useDispatch } from "react-redux";

import { LoadedState } from "../store";

import { createSelector } from "reselect";

import { includes } from "lodash/fp";
import {
  makeCountryToggleAction,
  makeCoutrySearchChangedAction,
} from "../actions";
import { IDataFrame } from "data-forge";

import { List, ListItem, Checkbox, TextField } from "@material-ui/core";

import { SpacedPaper } from "./SpacedPaper";

const dataSelector = (state: LoadedState) => state.data;
const pickedCountriesSelector = (state: LoadedState) =>
  state.ui.pickedCountries;
const searchTextSelector = (state: LoadedState) => state.ui.searchText;

const countrySelector = createSelector(
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

  const autoWidthItem: CSSProperties = {
    width: "180px",
  };

  const allCountries = useSelector(countrySelector).map(
    ({ iso_code, location, active }) => (
      <ListItem
        button
        key={iso_code}
        onClick={_ => dispatch(makeCountryToggleAction(iso_code))}
        style={autoWidthItem}
      >
        <Checkbox
          edge="start"
          checked={active}
          tabIndex={-1}
          disableRipple
          inputProps={{ "aria-labelledby": iso_code }}
        />
        {location}
      </ListItem>
    ),
  );

  const searchText = useSelector((state: LoadedState) => state.ui.searchText);

  const flexContainer: CSSProperties = {
    display: "flex",
    padding: 0,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <SpacedPaper elevation={3}>
      <label>
        <br />
        <TextField
          type="text"
          name="search"
          placeholder="Search Countries"
          onChange={e =>
            dispatch(makeCoutrySearchChangedAction(e.target.value))
          }
          value={searchText}
        />
        <List id="countries" style={flexContainer}>
          {allCountries}
        </List>
      </label>
    </SpacedPaper>
  );
};
