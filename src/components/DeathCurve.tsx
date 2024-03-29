import { useMediaQuery } from "@material-ui/core";
import { IDataFrame } from "data-forge";
import Highcharts, { SeriesOptionsType } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

import {
  colorMapSelector,
  countryNameSelector,
  dataSelector,
  pickedCountriesSelector,
} from "../selectors";
import { smooth } from "../store/data";
import { SpacedPaper } from "./SpacedPaper";

const deathCurveSelector = (
  pickedCountries: string[],
  data: IDataFrame,
  colorMap: Map<string, string>,
  countryNameMap: Map<string, string>,
): SeriesOptionsType[] =>
  pickedCountries.map(country => {
    const filteredByCountry = data.where(row => row.isoCode === country);

    const deaths = filteredByCountry.select(row => ({
      isoCode: row.isoCode,
      totalDeaths: row.totalDeaths,
      population: row.population,
      newDeaths: row.newDeaths,
    }));

    return {
      name: countryNameMap.get(country),
      type: "line",
      color: colorMap.get(country),
      data: smooth(
        7,
        deaths
          .toArray()
          .map(row => [
            row.totalDeaths / row.population,
            row.newDeaths / row.population,
          ])
          .sort(([a, _], [b, __]) => (a < b ? -1 : 1)),
      ).filter(([x, y]) => x !== 0 && y !== 0),
    };
  });

export const DeathCurve = (): JSX.Element => {
  const deaths = useSelector(
    createSelector(
      pickedCountriesSelector,
      dataSelector,
      colorMapSelector,
      countryNameSelector,
      deathCurveSelector,
    ),
  );

  const wide = useMediaQuery("(min-width:600px)");

  const options: Highcharts.Options = {
    title: {
      text: "",
    },
    chart: {
      height: wide ? "50%" : "100%",
      zoomType: "xy",
    },
    xAxis: {
      type: "logarithmic",
      title: {
        text: "Fraction of dead population",
      },
      min: 1e-6,
      tickInterval: 0.1,
      labels: {
        step: wide ? 1 : 5,
        formatter: function (): string {
          return this.value.toExponential(1);
        },
        rotation: -45,
      },
    },
    yAxis: {
      type: "logarithmic",
      title: {
        text: "Fraction of dead population per day (smoothed)",
      },
      tickInterval: 0.1,
      labels: {
        step: 1,
        formatter: function (): string {
          return this.value.toExponential(1);
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
