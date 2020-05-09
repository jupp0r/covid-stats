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
      .map(row => [row.date, row.total_cases]),
    type: "line",
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
    series: cases,
  };

  console.log(cases);
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
