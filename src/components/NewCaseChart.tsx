import React from "react";
import { Grid } from "@material-ui/core";
import { useSelector } from "react-redux";
import { LoadedState } from "../store";
import Highcharts, { SeriesOptionsType } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { smooth } from "../store/data";

export const NewCaseChart = () => {
  const selectedCountries = useSelector(
    (state: LoadedState) => state.ui.pickedCountries,
  );

  const data = useSelector((state: LoadedState) => state.data);
  const countryCharts = selectedCountries.map(country => {
    const countryData = {
      name: country,
      type: "column",
      data: data
        .where(
          row => row.iso_code === country && row.date > new Date("03-01-2020"),
        )
        .toArray()
        .map(row => [row.date.getTime(), row.new_cases])
        .sort(),
    };

    const movingAverage: SeriesOptionsType = {
      name: "7 day average",
      data: smooth(3, countryData.data),
      type: "line",
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
        title: {
          text: "Date",
        },
      },
      yAxis: {
        title: {
          text: "daily new cases",
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
      <Grid item>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Grid>
    );
  });

  return (
    <div>
      <h2>New Cases</h2>
      <Grid container justify="center" spacing={5}>
        {countryCharts}
      </Grid>
    </div>
  );
};
