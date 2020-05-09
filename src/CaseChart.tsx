import React from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { LoadedState } from "./store";
import { useSelector } from "react-redux";

const selectDataToRenderIntoChart = (
  state: LoadedState,
): {
  name: string;
  series: [Date, number][];
}[] =>
  state.ui.pickedCountries.map((pickedCountry: string) => ({
    name: pickedCountry,
    series: state.data
      .where(row => row.iso_code === pickedCountry)
      .toArray()
      .map(row => [row.date, row.total_cases]),
  }));

export const CaseChart = () => {
  const cases = useSelector(selectDataToRenderIntoChart);

  const options: Highcharts.Options = {
    title: {
      text: "Cases over time",
    },
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        month: "%e. %b",
        year: "%b",
      },
      title: {
        text: "Date",
      },
    },
    yAxis: {
      type: "logarithmic",
    },
    series: [
      {
        type: "line",
        name: "Cases",
        data: cases,
      },
    ],
  };

  console.log(cases);
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
