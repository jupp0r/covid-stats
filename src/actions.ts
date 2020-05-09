import { IDataFrame } from "data-forge";

import { Dispatch, bindActionCreators } from 'redux';

export type Action =
    InitialAction
    | ErrorDuringFetchAction
    | FetchSuccessAction
    | CountrySelectedAction;

export interface InitialAction {
    type: "initialized",
};
export const makeInitialized = (): InitialAction => (
    {
        type: "initialized",
    }
);

export interface ErrorDuringFetchAction {
    type: "error-during-fetch",
    message: string,
};
export const makeErrorDuringFetch = (message: string): ErrorDuringFetchAction => (
    {
        type: "error-during-fetch",
        message
    }
);

export interface FetchSuccessAction {
    type: "fetch-success",
    response: IDataFrame,
};
export const makeFetchSuccess = (response: IDataFrame): FetchSuccessAction => (
    {
        type: "fetch-success",
        response,
    }
)

export interface CountrySelectedAction {
    type: "country-selected",
    countryCodes: string[],
}
export const makeCountrySelectedAction = (countryCodes: string[]): CountrySelectedAction => (
    {
        type: "country-selected",
        countryCodes,
    }  
);

export const mapDispatchToProps = (dispatch: Dispatch<Action>) =>
    bindActionCreators({makeCountrySelectedAction}, dispatch)