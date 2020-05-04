import { DataFrame } from "dataframe-js";

export type Action = InitialAction | ErrorDuringFetchAction | FetchSuccessAction;

export interface InitialAction { type: "initialized" };

export interface ErrorDuringFetchAction { type: "error-during-fetch", message: string };

export interface FetchSuccessAction { type: "fetch-success", response: DataFrame };

export const makeInitialized = (): InitialAction => ({ type: "initialized" });
export const makeErrorDuringFetch = (message: string): ErrorDuringFetchAction => (
    { type: "error-during-fetch", message }
);

export const makeFetchSuccess = (response: DataFrame): FetchSuccessAction => (
    {type: "fetch-success", response}
)
