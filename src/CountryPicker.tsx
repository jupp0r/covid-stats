import React, { ChangeEvent } from "react";

import { LoadedState } from "./store";

export const CountryPicker = ({
  store,
  makeCountrySelectedAction,
}: {
  store: LoadedState;
  makeCountrySelectedAction: (countries: string[]) => void;
}) => {
  const allCoutries = store.data
    .select(
      ({ iso_code, location }: { iso_code: string; location: string }) => ({
        iso_code,
        location,
      }),
    )
    .distinct(row => row.iso_code)
    .toPairs()
    .map(
      ([_, { iso_code, location }]: [
        number,
        { iso_code: string; location: string },
      ]) => <option key={iso_code}>{location}</option>,
    );

  return (
    <div>
      <label>
        Country Picker
        <select
          name="countries"
          multiple
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            makeCountrySelectedAction(
              Array.from(e.target.selectedOptions).map(
                (elem: HTMLOptionElement) => elem.id,
              ),
            )
          }
          defaultValue={store.ui.pickedCountries}
        >
          {allCoutries}
        </select>
      </label>
    </div>
  );
};
