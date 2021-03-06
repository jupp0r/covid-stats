import { useMediaQuery } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { IDataFrame } from "data-forge";
import Highcharts, { SeriesOptionsType } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

import { makeCaseChartLogSettingChangedAction } from "../actions";
import {
  colorMapSelector,
  countryNameSelector,
  dataSelector,
  pickedCountriesSelector,
} from "../selectors";
import { LoadedState } from "../store";
import { Row } from "../store/data"
import { SpacedPaper } from "./SpacedPaper";

const selectDataToRenderIntoChart = (dataSelector: (row: Row) => number) => (
  pickedCountries: string[],
  data: IDataFrame,
  colorMap: Map<string, string>,
  countryNameMap: Map<string, string>,
): SeriesOptionsType[] =>
  pickedCountries.map((pickedCountry: string) => ({
    name: countryNameMap.get(pickedCountry) || "",
    data: data
      .where(row => row.isoCode === pickedCountry)
      .toArray()
      .map(row => [row.date.getTime(), dataSelector(row)]),
    type: "line",
    color: colorMap.get(pickedCountry),
  }));

const makeHighchartsOptions = ({
  logAxisSetting,
  cases,
  wide,
  yAxisLabel,
}: {
  logAxisSetting: "linear" | "logarithmic";
  cases: SeriesOptionsType[];
  wide: boolean;
  yAxisLabel: string;
}): Highcharts.Options => ({
  chart: {
    height: wide ? "50%" : "100%",
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
      text: yAxisLabel,
    },
  },
  series: cases,
  credits: {
    enabled: false,
  },
});

export const CaseChart = (): JSX.Element => {
  const cases = useSelector(
    createSelector(
      pickedCountriesSelector,
      dataSelector,
      colorMapSelector,
      countryNameSelector,
      selectDataToRenderIntoChart(
        row => (row.totalCases * 1000000) / row.population,
      ),
    ),
  );
  const logAxisSetting = useSelector(
    (state: LoadedState) => state.ui.caseChart.logSetting,
  );

  const dispatch = useDispatch();
  const handleAxisLogarithmicToggle = (_: React.MouseEvent, newSetting: string | null): void => {
    if (!newSetting) {
      return;
    }

    if (!(newSetting === "linear" || newSetting === "logarithmic")) {
      return;
    }

    dispatch(makeCaseChartLogSettingChangedAction(newSetting));
  };

  const wide = useMediaQuery("(min-width:600px)");
  const options = makeHighchartsOptions({ logAxisSetting, cases, wide, yAxisLabel: "Cases per 1M population" });

  return (
    <SpacedPaper id="cases" elevation={3}>
      <h2>Cases over Time</h2>
      <ToggleButtonGroup
        value={logAxisSetting}
        onChange={handleAxisLogarithmicToggle}
        exclusive
        aria-label="log axis setting"
      >
        <ToggleButton value="linear" aria-label="linear">
          linear
        </ToggleButton>
        <ToggleButton value="logarithmic" aria-label="logarithmic">
          log
        </ToggleButton>

      </ToggleButtonGroup>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </SpacedPaper>
  );
};

export const DeathChart = (): JSX.Element => {
  const cases = useSelector(
    createSelector(
      pickedCountriesSelector,
      dataSelector,
      colorMapSelector,
      countryNameSelector,
      selectDataToRenderIntoChart(
        row => (row.totalDeaths * 1000000) / row.population,
      ),
    ),
  );
  const logAxisSetting = useSelector(
    (state: LoadedState) => state.ui.caseChart.logSetting,
  );

  const wide = useMediaQuery("(min-width:600px)");
  const options = makeHighchartsOptions({ logAxisSetting, cases, wide, yAxisLabel: "Deaths per 1M population" });

  const dispatch = useDispatch();
  const handleAxisLogarithmicToggle = (_: React.MouseEvent, newSetting: string | null): void => {
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
      <h2>Deaths over Time</h2>
      <ToggleButtonGroup
        value={logAxisSetting}
        onChange={handleAxisLogarithmicToggle}
        exclusive
        aria-label="log axis setting"
      >
        <ToggleButton value="linear" aria-label="linear">
          linear
        </ToggleButton>
        <ToggleButton value="logarithmic" aria-label="logarithmic">
          log
        </ToggleButton>
      </ToggleButtonGroup>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </SpacedPaper>
  );
};
