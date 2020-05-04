import { Observable, of, from } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

import { filter, switchMap, flatMap, map} from 'rxjs/operators';

import { Action, makeErrorDuringFetch, makeFetchSuccess } from './actions';

import { combineEpics } from 'redux-observable';

import { parseCSV } from './data';
import { DataFrame } from 'dataframe-js';

type CovidDataResult = DataFrame | { type: "error", reason: string };

export const startLoadingEpic = (action$: Observable<Action>): Observable<Action> => {
    const covidData = action$.pipe(
        filter((action: Action) => action.type === 'initialized'),
        flatMap(() => fromFetch("https://covid.ourworldindata.org/data/owid-covid-data.csv")),
        switchMap((response: Response) => {
            if (response.ok) {
                return from(response.text()).pipe(
                    flatMap(parseCSV),
                    map(makeFetchSuccess))
            } else {
                return of(makeErrorDuringFetch(`Error ${response.status}`));
            }
        }));
    return covidData;
};

export const rootEpic = combineEpics(
  startLoadingEpic
);