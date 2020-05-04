import { IDataFrame } from "data-forge";

export type Action = InitialAction | ErrorDuringFetchAction | FetchSuccessAction;

export interface InitialAction { type: "initialized" };

export interface ErrorDuringFetchAction { type: "error-during-fetch", message: string };

export interface FetchSuccessAction { type: "fetch-success", response: IDataFrame };

export const makeInitialized = (): InitialAction => ({ type: "initialized" });
export const makeErrorDuringFetch = (message: string): ErrorDuringFetchAction => (
    { type: "error-during-fetch", message }
);

export const makeFetchSuccess = (response: IDataFrame): FetchSuccessAction => (
    {type: "fetch-success", response}
)
