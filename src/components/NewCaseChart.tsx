import { Grid } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { IDataFrame } from "data-forge";
import Highcharts, { SeriesOptionsType } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import {
  colorMapSelector,
  countryNameSelector,
  dataSelector,
  pickedCountriesSelector,
} from "../selectors";
import { smooth } from "../store/data";
import { Row } from "../store/data";
import { SpacedPaper } from "./SpacedPaper";

const newSelector = (selector: (row: any) => number, title: string) => (
  pickedCountries: string[],
  data: IDataFrame,
  colorMap: Map<string, string>,
  countryNameMap: Map<string, string>,
) =>
  pickedCountries.map(country => {
    const countryData = {
      name: countryNameMap.get(country),
      type: "column",
      color: colorMap.get(country),
      data: data
        .where(
          (row: Row) =>
            row.iso_code === country && row.date > new Date(2020, 2, 14),
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
  });

export const NewCaseChart = () => {
  const countryCharts = useSelector(
    createSelector(
      pickedCountriesSelector,
      dataSelector,
      colorMapSelector,
      countryNameSelector,
      newSelector(
        (row: Row) => (row.new_cases * 1000000) / row.population,
        "daily new cases per 1M population",
      ),
    ),
  );

  return (
    <SpacedPaper elevation={3} id="new-cases">
      <h2>New Cases</h2>
      <Grid container justify="center" spacing={0}>
        {countryCharts}
      </Grid>
    </SpacedPaper>
  );
};

export const NewDeathChart = () => {
  const countryCharts = useSelector(
    createSelector(
      pickedCountriesSelector,
      dataSelector,
      colorMapSelector,
      countryNameSelector,
      newSelector(
        (row: Row) => (row.new_deaths * 1000000) / row.population,
        "daily new deaths per 1M population",
      ),
    ),
  );

  return (
    <SpacedPaper elevation={3} id="new-deaths">
      <h2>New Deaths</h2>
      <Grid container justify="center" spacing={0}>
        {countryCharts}
      </Grid>
    </SpacedPaper>
  );
};
