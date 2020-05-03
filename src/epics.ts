import { Observable } from 'rxjs';

import { filter, mapTo, delay } from 'rxjs/operators';

import { Action } from './actions';

export const startLoadingEpic = (action$: Observable<Action>): Observable<Action> => action$.pipe(
    filter((action: Action) => action.type === 'initialized'),
    delay(1000),
    mapTo({ type: 'initialized' })
);