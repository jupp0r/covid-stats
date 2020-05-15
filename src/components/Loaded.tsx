import React from "react";

import { CaseChart } from "./CaseChart";
import { CountryPicker } from "./CountryPicker";
import { DeathCurve } from "./DeathCurve";
import { NewCaseChart } from "./NewCaseChart";

const centered: React.CSSProperties = { textAlign: "center" };

export const Loaded = () => {
  return (
    <div>
      <CountryPicker />
      <hr />
      <NewCaseChart />
      <hr />
      <CaseChart />
      <hr />
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
