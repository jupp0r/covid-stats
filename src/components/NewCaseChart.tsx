import { FormControlLabel, FormGroup, Grid, Switch } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { IDataFrame } from "data-forge";
import Highcharts, { SeriesOptionsType } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { max as lMax, round as lRound } from "lodash"
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { makeSyncAxisToggleAction, SyncAxisToggleAction } from "../actions";
import {
  colorMapSelector,
  countryNameSelector,
  dataSelector,
  pickedCountriesSelector,
} from "../selectors";
import { LoadedState } from "../store";
import { smooth } from "../store/data";
import { Row } from "../store/data";
import { SpacedPaper } from "./SpacedPaper";

const newSelector = (selector: (row: Row) => number, title: string) => (
  pickedCountries: string[],
  data: IDataFrame,
  colorMap: Map<string, string>,
  countryNameMap: Map<string, string>,
  isSynced: boolean,
): JSX.Element[] => {
  const maxValue =
    lMax(
      data
        .where(
          (row: Row) => pickedCountries.includes(row.isoCode))
        .toArray()
        .map((row: Row) => selector(row)))
    || 1000;

  const order = Math.pow(10, Math.floor(Math.log10(maxValue)));
  const yAxisMax = lRound(maxValue + (order / 2), -Math.log10(order));

  return pickedCountries.map(country => {
    const countryData = {
      name: countryNameMap.get(country),
      type: "column",
      color: colorMap.get(country),
      data: data
        .where(
          (row: Row) =>
            row.isoCode === country && row.date > new Date(2020, 2, 14),
        )
        .toArray()
        .map(row => [row.date.getTime(), selector(row)])
        .sort(),
    };

    const movingAverage: SeriesOptionsType = {
      name: "7 day average",
      data: smooth(3, countryData.data),
      type: "line",
      color: red[900],
      enableMouseTracking: false,
    };

    const options: Highcharts.Options = {
      chart: {
        height: "300",
        width: "300",
      },
      title: {
        text: countryNameMap.get(country),
      },
      xAxis: {
        type: "datetime",
        tickInterval: 7 * 24 * 3600 * 1000,
      },
      yAxis: {
        min: 0,
        max: isSynced ? yAxisMax : null,
        title: {
          text: title,
        },
      },
      legend: {
        enabled: false,
      },
      series: [countryData as SeriesOptionsType, movingAverage],
      credits: {
        enabled: false,
      },
    };

    return (
      <Grid item key={country}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Grid>
    );
  })
};

const isSyncedSelector = (state: LoadedState): boolean => state.ui.caseChart.syncAxes;

const SyncSwitch = (): JSX.Element => {
  const isSynced = useSelector(isSyncedSelector);
  const dispatch = useDispatch();

  const handleChange = (): SyncAxisToggleAction => dispatch(makeSyncAxisToggleAction());

  return (<FormGroup row>
    <FormControlLabel
      control={<Switch checked={isSynced} onChange={handleChange} name="syncAxes" />}
      label="Sync Axis Range"
    /></FormGroup>);
}

export const NewCaseChart = (): JSX.Element => {
  const countryCharts = useSelector(
    createSelector(
      pickedCountriesSelector,
      dataSelector,
      colorMapSelector,
      countryNameSelector,
      isSyncedSelector,
      newSelector(
        (row: Row) => (row.newCases * 1000000) / row.population,
        "daily new cases per 1M population",
      ),
    ),
  );

  return (
    <SpacedPaper elevation={3} id="new-cases">
      <h2>New Cases</h2>
      <SyncSwitch />
      <Grid container justify="center" spacing={0}>
        {countryCharts}
      </Grid>
    </SpacedPaper>
  );
};

export const NewDeathChart = (): JSX.Element => {
  const countryCharts = useSelector(
    createSelector(
      pickedCountriesSelector,
      dataSelector,
      colorMapSelector,
      countryNameSelector,
      isSyncedSelector,
      newSelector(
        (row: Row) => (row.newDeaths * 1000000) / row.population,
        "daily new deaths per 1M population",
      ),
    ),
  );

  return (
    <SpacedPaper elevation={3} id="new-deaths">
      <h2>New Deaths</h2>
      <SyncSwitch />
      <Grid container justify="center" spacing={0}>
        {countryCharts}
      </Grid>
    </SpacedPaper>
  );
};
