import { Checkbox } from "@material-ui/core";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { IDataFrame } from "data-forge";
import { includes } from "lodash/fp";
import MaterialTable, { Column, Icons } from "material-table";
import React from "react";
import { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeDataTableDateSelectionChangedAction } from "../actions";
import { makeCountryToggleAction } from "../actions";
import { LoadedState } from "../store";
import { Row } from "../store/data";
import { SpacedPaper } from "./SpacedPaper";

type TableRow = Row & {
  "testsPer1MPopulation": string;
}

const tableIcons: Icons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const datesAreOnSameDay = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const DataTable = (): JSX.Element => {
  const data = useSelector((state: LoadedState) => state.data);

  const pickedCountriesSelector = (state: LoadedState): string[] =>
    state.ui.pickedCountries;
  const pickedCountries = useSelector(pickedCountriesSelector);
  const isSelected = (isoCode: string): boolean => includes(isoCode)(pickedCountries);

  const dateToDisplay = useSelector(
    (state: LoadedState) => state.ui.dataTable.dateToDisplay,
  );

  const today = new Date();
  const dateOffset = 24 * 60 * 60 * 1000 * 1; // 1 day
  const yesterday = new Date();
  yesterday.setTime(yesterday.getTime() - dateOffset);

  const selectedDate = dateToDisplay === "today" ? today : yesterday;

  const findFirstRowMachingDate = (
    group: IDataFrame<number, Row>,
    date: Date,
    field: keyof Row,
  ): string | number | Date | undefined => {
    const filtered: IDataFrame<
      number,
      Row
    > = group.where((row: { date: Date }) =>
      datesAreOnSameDay(row.date, selectedDate),
    );

    if (filtered.count() === 0) {
      const filteredByAnythingPresent = group
        .orderByDescending(row => row.date)
        .where((row: Row) => row[field] !== undefined);

      if (filteredByAnythingPresent.count() === 0) {
        return undefined;
      }

      return filteredByAnythingPresent.first()[field];
    }

    return filtered.first()[field];
  };

  const tableData = data
    .orderByDescending((row: Row) => row.date)
    .groupBy((row: Row) => row.isoCode)
    .select(group => ({
      date: group.first().date,
      isoCode: group.first().isoCode,
      location: group.first().location,
      totalCases: findFirstRowMachingDate(group, selectedDate, "totalCases") as number,
      newCases: findFirstRowMachingDate(group, selectedDate, "newCases") as number,
      totalTests: group
        .getSeries("totalTests")
        .select(x => (x ? x : 0))
        .max(),
      population: group.first().population,
    }))
    .toArray()
    .map(row => ({
      ...row,
      date: row.date.toString(),
      testsPer1MPopulation: Math.round(
        (row.totalTests * 1000000) / row.population,
      ),
    }));

  const numberWithCommas = (field: keyof typeof tableData[0]) => (rowData: typeof tableData[0]): string =>
    rowData[field].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

  const columns: Column<typeof tableData[0]>[] = [
    {
      title: "Country",
      field: "location",
      render: (row: typeof tableData[0]): JSX.Element => (
        <>
          <Checkbox
            checked={isSelected(row.isoCode)}
            onChange={(_): void => { dispatch(makeCountryToggleAction(row.isoCode)); }}
          />{" "}
          {row.location}
        </>
      ),
    },
    {
      title: "Total Cases",
      field: "totalCases",
      type: "numeric",
      defaultSort: "desc",
      render: numberWithCommas("totalCases"),
    },
    {
      title: "New Cases",
      field: "newCases",
      type: "numeric",
      render: numberWithCommas("newCases"),
    },
    {
      title: "Tests per 1M population",
      field: "testsPer1MPopulation",
      type: "numeric",
      render: numberWithCommas("testsPer1MPopulation"),
    },
    {
      title: "Total Tests",
      field: "totalTests",
      type: "numeric",
      render: numberWithCommas("totalTests"),
    },
  ];

  const dispatch = useDispatch();
  const handleDateSelection = (_: React.MouseEvent, newSetting: string | null): void => {
    if (!newSetting) {
      return;
    }

    if (!(newSetting === "today" || newSetting === "yesterday")) {
      return;
    }

    dispatch(makeDataTableDateSelectionChangedAction(newSetting));
  };

  const options = {
    fixedColumns: {
      left: 1,
      right: 0,
    },
  };

  return (
    <SpacedPaper>
      <ToggleButtonGroup
        value={dateToDisplay}
        onChange={handleDateSelection}
        exclusive
        aria-label="log axis setting"
      >
        <ToggleButton value="today" aria-label="today">
          today
        </ToggleButton>
        <ToggleButton value="yesterday" aria-label="yesterday">
          yesterday
        </ToggleButton>
      </ToggleButtonGroup>
      <MaterialTable
        columns={columns}
        data={tableData}
        title="Country Table"
        icons={tableIcons}
        options={options}
      ></MaterialTable>
    </SpacedPaper>
  );
};
