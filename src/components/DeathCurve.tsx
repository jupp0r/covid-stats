import React from "react";

import Highcharts, { SeriesOptionsType } from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useSelector } from "react-redux";
import { LoadedState } from "../store";

import { smooth } from "../store/data";

const deathCurveSelector = (state: LoadedState): SeriesOptionsType[] =>
  state.ui.pickedCountries.map(country => {
    const filteredByCountry = state.data.where(row => row.iso_code === country);

    const deaths = filteredByCountry.select(row => ({
      iso_code: row.iso_code,
      total_deaths: row.total_deaths,
      population: row.population,
      new_deaths: row.new_deaths,
    }));

    return {
      name: country,
      type: "line",
      data: smooth(
        2,
        deaths
          .toArray()
          .map(row => [
            row.total_deaths / row.population,
            row.new_deaths / row.population,
          ])
          .sort(([a, _], [b, __]) => (a < b ? -1 : 1)),
      ).filter(([x, y]) => x !== 0 && y !== 0),
    };
  });

export const DeathCurve = () => {
  const deaths = useSelector(deathCurveSelector);

  const options: Highcharts.Options = {
    title: {
      text: "Death Curve",
    },
    chart: {
      height: "50%",
      zoomType: "xy",
    },
    xAxis: {
      type: "logarithmic",
      title: {
        text: "Fraction of dead population",
      },
      min: 1e-6,
      tickInterval: 1,
      labels: {
        step: 1,
        formatter: function () {
          return this.value.toExponential(0);
        },
      },
    },
    yAxis: {
      type: "logarithmic",
      title: {
        text: "Fraction of dead population per day (smoothed)",
      },
      min: 1e-7,
      tickInterval: 1,
      labels: {
        step: 1,
        formatter: function () {
          return this.value.toExponential(0);
        },
      },
    },
    series: deaths,
    credits: {
      enabled: false,
    },
  };

  return (
    <div id="deathcurve">
      <h2>
        Robins Death Curve
        <span role="img" aria-label="tm">
          ™️
        </span>
      </h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
