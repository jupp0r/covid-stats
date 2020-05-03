import {configureStore} from '@reduxjs/toolkit';
import {reducer} from './reducers';

export type State = LoadingState | LoadedState;

export interface LoadingState {
    type: "loading",
}

export interface LoadedState {
    type: "loaded"
}

export const initialState: State = {type: "loading"};

export const store = configureStore({reducer});