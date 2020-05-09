import React from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { LoadedState } from "./store";

export const CaseChart = ({ store }: { store: LoadedState }) => {
  const cases = Object.entries(
    store.data.toObject(
      row => row.date,
      row => row.total_cases,
    ),
  );

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
