import {configureStore} from '@reduxjs/toolkit';
import {reducer} from './reducers';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic } from './epics';
import { makeInitialized } from './actions'
import { IDataFrame } from 'data-forge';
import { Store as ReduxStore } from 'redux';
import { Action } from './actions';

export type State = LoadingState | LoadedState | ErrorState;

export interface LoadingState {
    type: "loading",
}

export interface UIState {
    pickedCountries: string[],
    searchText: string,
}

export interface LoadedState {
    type: "loaded",
    data: IDataFrame,
    ui: UIState,
}

export interface ErrorState {
    type: "error",
    message: string,
}

export const initialState: State = {type: "loading"};

export type Store = ReduxStore<State, Action>;

const epicMiddleware = createEpicMiddleware();
export const store = configureStore({
    reducer,
    middleware: [epicMiddleware],
});
epicMiddleware.run(rootEpic);

store.dispatch(makeInitialized());