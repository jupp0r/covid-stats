import React from "react";

import { CaseChart } from "./CaseChart";
import { CountryPicker } from "./CountryPicker";
import { DeathCurve } from "./DeathCurve";

export const Loaded = () => {
  return (
    <div>
      <CountryPicker />
      <CaseChart />
      <DeathCurve />
    </div>
  );
};
