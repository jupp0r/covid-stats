import React from "react";

import { CaseChart, DeathChart } from "./CaseChart";
import { CountryPicker } from "./CountryPicker";
import { DataTable } from "./DataTable";
import { DeathCurve } from "./DeathCurve";
import { NewCaseChart, NewDeathChart } from "./NewCaseChart";

const centered: React.CSSProperties = { textAlign: "center" };

export const Loaded = () => {
  return (
    <div>
      <h1>Covid Stats</h1>
      <DataTable />
      <CountryPicker />
      <NewCaseChart />
      <NewDeathChart />
      <CaseChart />
      <DeathChart />
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
