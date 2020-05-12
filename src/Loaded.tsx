import React from "react";

import { CaseChart } from "./CaseChart";
import { CountryPicker } from "./CountryPicker";
import { DeathCurve } from "./DeathCurve";

const centered: React.CSSProperties = { textAlign: "center" };

export const Loaded = () => {
  return (
    <div>
      <CountryPicker />
      <CaseChart />
      <DeathCurve />
      <div style={centered}>
        data from{" "}
        <a href="https://covid.ourworldindata.org">Our World In Data</a> and{" "}
        <a href="https://github.com/datasets/population">
          datahub.io via the World Bank
        </a>
      </div>
    </div>
  );
};
