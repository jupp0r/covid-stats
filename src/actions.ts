import { IDataFrame } from "data-forge";

export type Action =
  | InitialAction
  | ErrorDuringFetchAction
  | FetchSuccessAction
  | CountryToggleAction
  | CountrySearchChangedAction
  | ProgressAction;

export interface InitialAction {
  type: "initialized";
}
export const makeInitialized = (): InitialAction => ({
  type: "initialized",
});

export interface ErrorDuringFetchAction {
  type: "error-during-fetch";
  message: string;
}
export const makeErrorDuringFetch = (
  message: string,
): ErrorDuringFetchAction => ({
  type: "error-during-fetch",
  message,
});

export interface FetchSuccessAction {
  type: "fetch-success";
  response: IDataFrame;
}
export const makeFetchSuccess = (response: IDataFrame): FetchSuccessAction => ({
  type: "fetch-success",
  response,
});

export interface CountryToggleAction {
  type: "country-toggled";
  countryCode: string;
}
export const makeCountryToggleAction = (
  countryCode: string,
): CountryToggleAction => ({
  type: "country-toggled",
  countryCode,
});

export interface CountrySearchChangedAction {
  type: "country-search-changed";
  search: string;
}

export const makeCoutrySearchChangedAction = (
  search: string,
): CountrySearchChangedAction => ({
  type: "country-search-changed",
  search,
});

export interface ProgressAction {
  type: "progress";
  target: "covid" | "population";
  done: number;
  total: number;
}

export const makeProgressAction = (progress: {
  target: "covid" | "population";
  done: number;
  total: number;
}): ProgressAction => {
  return { ...progress, type: "progress" };
};
