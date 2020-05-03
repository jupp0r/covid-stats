import { Observable, of, from } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

import { filter, switchMap, flatMap, map} from 'rxjs/operators';

import { Action, makeErrorDuringFetch, makeFetchSuccess } from './actions';

import { combineEpics } from 'redux-observable';


export const startLoadingEpic = (action$: Observable<Action>): Observable<Action> => action$.pipe(
    filter((action: Action) => action.type === 'initialized'),
    flatMap(() => fromFetch("https://covid.ourworldindata.org/data/owid-covid-data.csv")),
    switchMap((response: Response) => {
        if (response.ok) {
          return from(response.text).pipe(map(makeFetchSuccess))
        } else {
          return of(makeErrorDuringFetch(`Error ${response.status}`));
        }
      })
);

export const rootEpic = combineEpics(
  startLoadingEpic
);