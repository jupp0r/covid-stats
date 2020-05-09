import React from "react";

import { CaseChart } from "./CaseChart";
import { CountryPicker } from "./CountryPicker";

export const Loaded = () => {
  return (
    <div>
      <CountryPicker />
      <CaseChart />
    </div>
  );
};
