import React from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { LoadedState } from "./store";
import { useSelector } from "react-redux";

const selectDataToRenderIntoChart = (
  state: LoadedState,
): {
  name: string;
  data: [Date, number][];
  type: "line";
}[] =>
  state.ui.pickedCountries.map((pickedCountry: string) => ({
    name: pickedCountry,
    data: state.data
      .where(row => row.iso_code === pickedCountry)
      .toArray()
      .map(row => [
        row.date.getTime(),
        (row.total_cases * 1000000) / row.population,
      ]),
    type: "line",
  }));

export const CaseChart = () => {
  const cases = useSelector(selectDataToRenderIntoChart);

  const options: Highcharts.Options = {
    title: {
      text: "Cases over time",
    },
    chart: {
      height: "50%",
      zoomType: "x",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date",
      },
      labels: {
        step: 1,
      },
    },
    yAxis: {
      type: "logarithmic",
      title: {
        text: "Cases per 1M population",
      },
    },
    series: cases,
    credits: {
      enabled: false,
    },
  };

  return (
    <div id="cases">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
