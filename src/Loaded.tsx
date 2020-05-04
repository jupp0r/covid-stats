import React from "react";

import { LoadedState } from "./store";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export const Loaded = ({ store }: { store: LoadedState }) => {
  const cases = Object.entries(
    store.data.toObject(
      row => row.date,
      row => row.total_cases,
    ),
  );

  console.log(cases);
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

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
