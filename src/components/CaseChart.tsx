import React from "react";

import { createSelector } from "reselect";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { LoadedState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { makeCaseChartLogSettingChangedAction } from "../actions";

import { SpacedPaper } from "./SpacedPaper";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import { IDataFrame } from "data-forge";

import {
  pickedCountriesSelector,
  dataSelector,
  colorMapSelector,
} from "../selectors";

const selectDataToRenderIntoChart = (
  pickedCountries: string[],
  data: IDataFrame,
  colorMap: Map<string, string>,
): {
  name: string;
  data: [Date, number][];
  type: "line";
  color: string | undefined;
}[] =>
  pickedCountries.map((pickedCountry: string) => ({
    name: pickedCountry,
    data: data
      .where(row => row.iso_code === pickedCountry)
      .toArray()
      .map(row => [
        row.date.getTime(),
        (row.total_cases * 1000000) / row.population,
      ]),
    type: "line",
    color: colorMap.get(pickedCountry),
  }));

export const CaseChart = () => {
  const cases = useSelector(
    createSelector(
      pickedCountriesSelector,
      dataSelector,
      colorMapSelector,
      selectDataToRenderIntoChart,
    ),
  );
  const logAxisSetting = useSelector(
    (state: LoadedState) => state.ui.caseChart.logSetting,
  );

  const options: Highcharts.Options = {
    chart: {
      height: "50%",
      zoomType: "x",
    },
    title: {
      text: "",
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
      type: logAxisSetting,
      title: {
        text: "Cases per 1M population",
      },
    },
    series: cases,
    credits: {
      enabled: false,
    },
  };

  const dispatch = useDispatch();
  const handleAxisLogarithmicToggle = (_: any, newSetting: string | null) => {
    if (!newSetting) {
      return;
    }

    if (!(newSetting === "linear" || newSetting === "logarithmic")) {
      return;
    }

    dispatch(makeCaseChartLogSettingChangedAction(newSetting));
  };

  return (
    <SpacedPaper id="cases" elevation={3}>
      <h2>Cases over Time</h2>
      <ToggleButtonGroup
        value={logAxisSetting}
        onChange={handleAxisLogarithmicToggle}
        exclusive
        aria-label="log axis setting"
      >
        <ToggleButton value="logarithmic" aria-label="logarithmic">
          log
        </ToggleButton>
        <ToggleButton value="linear" aria-label="linear">
          linear
        </ToggleButton>
      </ToggleButtonGroup>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </SpacedPaper>
  );
};
