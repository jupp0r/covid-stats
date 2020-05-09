import React from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { LoadedState } from "./store";
import { useSelector } from "react-redux";
import { includes } from "lodash/fp";

const selectDataToRenderIntoChart = (state: LoadedState) =>
  Object.entries(
    state.data
      .where(row => includes(row.iso_code)(state.ui.pickedCountries))
      .toObject(
        row => row.date,
        row => row.total_cases,
      ),
  );

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
