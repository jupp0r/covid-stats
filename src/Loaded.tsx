import React from "react";

import { CaseChart } from "./CaseChart";
import { CountryPicker } from "./CountryPicker";
import { LoadedState } from "./store";

export const Loaded = ({
  store,
  makeCountriesSelectedAction,
}: {
  store: LoadedState;
  makeCountriesSelectedAction: (countries: string[]) => void;
}) => {
  return (
    <div>
      <CountryPicker
        store={store}
        makeCountrySelectedAction={makeCountriesSelectedAction}
      />
      <CaseChart store={store} />
    </div>
  );
};
