import React from "react";
import { Grid } from "@material-ui/core";
import { useSelector } from "react-redux";
import { IDataFrame } from "data-forge";
import { createSelector } from "reselect";
import Highcharts, { SeriesOptionsType } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { smooth } from "../store/data";
import { SpacedPaper } from "./SpacedPaper";
import {
  pickedCountriesSelector,
  dataSelector,
  colorMapSelector,
} from "../selectors";

import { red } from "@material-ui/core/colors";

export const NewCaseChart = () => {
  const countryCharts = useSelector(
    createSelector(
      pickedCountriesSelector,
      dataSelector,
      colorMapSelector,
      (
        pickedCountries: string[],
        data: IDataFrame,
        colorMap: Map<string, string>,
      ) =>
        pickedCountries.map(country => {
          const countryData = {
            name: country,
            type: "column",
            color: colorMap.get(country),
            data: data
              .where(
                row =>
                  row.iso_code === country && row.date > new Date("02-14-2020"),
              )
              .toArray()
              .map(row => [
                row.date.getTime(),
                (row.new_cases * 1000000) / row.population,
              ])
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
              text: country,
            },
            xAxis: {
              type: "datetime",
              tickInterval: 7 * 24 * 3600 * 1000,
            },
            yAxis: {
              min: 0,
              title: {
                text: "daily new cases per 1M population",
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
        }),
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
