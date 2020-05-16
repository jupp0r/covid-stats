import React from "react";

import Highcharts, { SeriesOptionsType } from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { useSelector } from "react-redux";
import { IDataFrame } from "data-forge";

import { createSelector } from "reselect";

import { smooth } from "../store/data";

import { SpacedPaper } from "./SpacedPaper";

import {
  pickedCountriesSelector,
  dataSelector,
  colorMapSelector,
} from "../selectors";

const deathCurveSelector = (
  pickedCountries: string[],
  data: IDataFrame,
  colorMap: Map<string, string>,
): SeriesOptionsType[] =>
  pickedCountries.map(country => {
    const filteredByCountry = data.where(row => row.iso_code === country);

    const deaths = filteredByCountry.select(row => ({
      iso_code: row.iso_code,
      total_deaths: row.total_deaths,
      population: row.population,
      new_deaths: row.new_deaths,
    }));

    return {
      name: country,
      type: "line",
      color: colorMap.get(country),
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
  const deaths = useSelector(
    createSelector(
      pickedCountriesSelector,
      dataSelector,
      colorMapSelector,
      deathCurveSelector,
    ),
  );

  const options: Highcharts.Options = {
    title: {
      text: "",
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
    <SpacedPaper id="deathcurve" elevation={3}>
      <h2>
        Robins Death Curve
        <span role="img" aria-label="tm">
          ™️
        </span>
      </h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </SpacedPaper>
  );
};
