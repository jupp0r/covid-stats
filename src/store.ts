import {configureStore} from '@reduxjs/toolkit';
import {reducer} from './reducers';

import { createEpicMiddleware } from 'redux-observable';

import { rootEpic } from './epics';

import { makeInitialized } from './actions'

import { DataFrame } from 'dataframe-js';

export type State = LoadingState | LoadedState | ErrorState;

export interface LoadingState {
    type: "loading",
}

export interface LoadedState {
    type: "loaded",
    data: DataFrame,
}

export interface ErrorState {
    type: "error",
    message: string,
}

export const initialState: State = {type: "loading"};

const epicMiddleware = createEpicMiddleware();
export const store = configureStore({
    reducer,
    middleware: [epicMiddleware],
});
epicMiddleware.run(rootEpic);

store.dispatch(makeInitialized());