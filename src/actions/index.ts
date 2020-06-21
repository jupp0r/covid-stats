import { IDataFrame } from "data-forge";

export type Action =
  | InitialAction
  | ErrorDuringFetchAction
  | FetchSuccessAction
  | CountryToggleAction
  | CountrySearchChangedAction
  | ProgressAction
  | UrlUpdatedAction
  | CaseChartLogSettingChangedAction
  | DataTableDateSelectionChangedAction
  | SyncAxisToggleAction;

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

export type DownloadCategory = "covid" | "population" | "us" | "stateInfo";

export interface ProgressAction {
  type: "progress";
  target: DownloadCategory;
  done: number;
  total: number;
}

export const makeProgressAction = (progress: {
  target: DownloadCategory;
  done: number;
  total: number;
}): ProgressAction => {
  return { ...progress, type: "progress" };
};

export interface UrlUpdatedAction {
  type: "url-updated";
  url: string;
}

export const makeUrlUpdated = (url: string): UrlUpdatedAction => ({
  type: "url-updated",
  url,
});

export interface CaseChartLogSettingChangedAction {
  type: "case-chart-log-setting-changed";
  newSetting: "linear" | "logarithmic";
}

export const makeCaseChartLogSettingChangedAction = (
  newSetting: "linear" | "logarithmic",
): CaseChartLogSettingChangedAction => ({
  type: "case-chart-log-setting-changed",
  newSetting,
});

export interface DataTableDateSelectionChangedAction {
  type: "data-table-date-selection-changed";
  newSetting: "today" | "yesterday";
}

export const makeDataTableDateSelectionChangedAction = (
  newSetting: "today" | "yesterday",
): DataTableDateSelectionChangedAction => ({
  type: "data-table-date-selection-changed",
  newSetting,
});

export interface SyncAxisToggleAction {
  type: "sync-axis-toggle";
};

export const makeSyncAxisToggleAction = (): SyncAxisToggleAction => ({
  type: "sync-axis-toggle",
});