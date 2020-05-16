import React from "react";
import { useSelector, useDispatch } from "react-redux";
import MaterialTable, { Icons, Column } from "material-table";
import { SpacedPaper } from "./SpacedPaper";
import { LoadedState } from "../store";

import { forwardRef } from "react";

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
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";

import { makeDataTableDateSelectionChangedAction } from "../actions";

import { IDataFrame } from "data-forge";

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

const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const DataTable = () => {
  const data = useSelector((state: LoadedState) => state.data);
  const dateToDisplay = useSelector(
    (state: LoadedState) => state.ui.dataTable.dateToDisplay,
  );

  const today = new Date();
  const dateOffset = 24 * 60 * 60 * 1000 * 1; // 1 day
  let yesterday = new Date();
  yesterday.setTime(yesterday.getTime() - dateOffset);

  const selectedDate = dateToDisplay === "today" ? today : yesterday;

  const findFirstRowMachingDate = (
    group: IDataFrame,
    date: Date,
    field: string,
  ) => {
    const filtered: IDataFrame = group.where((row: { date: Date }) =>
      datesAreOnSameDay(row.date, selectedDate),
    );

    if (filtered.count() === 0) {
      const filteredByAnythingPresent = group
        .orderByDescending(row => row.date)
        .where(row => row[field]);

      if (filteredByAnythingPresent.count() === 0) {
        return undefined;
      }

      return filteredByAnythingPresent.first()[field];
    }

    return filtered.first()[field];
  };

  const tableData = data
    .orderByDescending(row => row.date)
    .groupBy(row => row.iso_code)
    .select(group => ({
      date: group.first().date,
      iso_code: group.first().iso_code,
      location: group.first().location,
      total_cases: findFirstRowMachingDate(group, selectedDate, "total_cases"),
      new_cases: findFirstRowMachingDate(group, selectedDate, "new_cases"),
      total_tests: group
        .getSeries("total_tests")
        .select(x => (x ? x : 0))
        .max(),
      population: group.first().population,
    }))
    .toArray()
    .map(row => ({
      ...row,
      date: row.date.toString(),
      tests_per_1m_population: Math.round(
        (row.total_tests * 1000000) / row.population,
      ),
    }));

  const columns: Column<any>[] = [
    {
      title: "Country",
      field: "location",
    },
    {
      title: "Total Cases",
      field: "total_cases",
      type: "numeric",
      defaultSort: "desc",
    },
    {
      title: "New Cases",
      field: "new_cases",
      type: "numeric",
    },
    {
      title: "Tests per 1M population",
      field: "tests_per_1m_population",
      type: "numeric",
    },
    {
      title: "Total Tests",
      field: "total_tests",
      type: "numeric",
    },
  ];

  const dispatch = useDispatch();
  const handleDateSelection = (_: any, newSetting: string | null) => {
    if (!newSetting) {
      return;
    }

    if (!(newSetting === "today" || newSetting === "yesterday")) {
      return;
    }

    dispatch(makeDataTableDateSelectionChangedAction(newSetting));
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
      ></MaterialTable>
    </SpacedPaper>
  );
};
