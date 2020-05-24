import { Checkbox, List, ListItem, TextField } from "@material-ui/core";
import { IDataFrame } from "data-forge";
import { includes } from "lodash/fp";
import React, { CSSProperties } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import {
  makeCountryToggleAction,
  makeCoutrySearchChangedAction,
} from "../actions";
import { LoadedState } from "../store";
import { SpacedPaper } from "./SpacedPaper";

const dataSelector = (state: LoadedState): IDataFrame => state.data;
const pickedCountriesSelector = (state: LoadedState): string[] =>
  state.ui.pickedCountries;
const searchTextSelector = (state: LoadedState): string => state.ui.searchText;

const countrySelector = createSelector(
  dataSelector,
  pickedCountriesSelector,
  searchTextSelector,
  (data: IDataFrame, pickedCountries: string[], searchText) =>
    data
      .select(
        ({ isoCode, location }: { isoCode: string; location: string }) => ({
          isoCode,
          location,
        }),
      )
      .distinct(row => row.isoCode)
      .orderBy(row => row.location)
      .toPairs()
      .map(([_, row]) => ({
        ...row,
        active: includes(row.isoCode)(pickedCountries),
      }))
      .filter(
        row =>
          row.active ||
          (searchText !== "" &&
            row.location.toLowerCase().startsWith(searchText.toLowerCase())),
      ),
);

export const CountryPicker = (): JSX.Element => {
  const dispatch = useDispatch();

  const autoWidthItem: CSSProperties = {
    width: "180px",
  };

  const allCountries = useSelector(countrySelector).map(
    ({ isoCode, location, active }) => (
      <ListItem
        button
        key={isoCode}
        onClick={(_): void => { dispatch(makeCountryToggleAction(isoCode)); }}
        style={autoWidthItem}
      >
        <Checkbox
          edge="start"
          checked={active}
          tabIndex={-1}
          disableRipple
          inputProps={{ "aria-labelledby": isoCode }}
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
          onChange={
            (e): void => { dispatch(makeCoutrySearchChangedAction(e.target.value)); }
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
