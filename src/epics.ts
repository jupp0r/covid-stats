import { Observable, of, from, zip } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

import { filter, switchMap, flatMap, map } from 'rxjs/operators';

import { Action } from './actions';

import { combineEpics } from 'redux-observable';

import { parseCovidCSV, parsePopulationCSV, mergeCovidPopulation } from './data';
import { IDataFrame } from 'data-forge';

type DataResult = { type: "success", data: IDataFrame } | { type: "error", reason: string };

export const startLoadingEpic = (action$: Observable<Action>): Observable<Action> => {
    const covidData$: Observable<DataResult> = action$.pipe(
        filter((action: Action) => action.type === 'initialized'),
        flatMap(() => fromFetch("https://covid.ourworldindata.org/data/owid-covid-data.csv")),
        switchMap((response: Response) => {
            console.log("covid");
            if (response.ok) {
                return from(response.text()).pipe(
                    flatMap(parseCovidCSV),
                    map((data: IDataFrame): DataResult => ({ type: "success", data })));
            } else {
                return of<DataResult>({ type: "error", reason: `${response.status}` });
            }
        }));

    const populationData$: Observable<DataResult> = action$.pipe(
        filter((action: Action) => action.type === 'initialized'),
        flatMap(() => fromFetch("https://raw.githubusercontent.com/datasets/population/master/data/population.csv")),
        switchMap((response: Response) => {
            console.log("population");
            if (response.ok) {
                return from(response.text()).pipe(
                    flatMap(parsePopulationCSV),
                    map((data: IDataFrame): DataResult => ({ type: "success", data })),
                );
            } else {
                return of<DataResult>({ type: "error", reason: `${response.status}` });
            }
        })
    );

    return zip(covidData$, populationData$)
        .pipe(
            map(
                ([ covid, population ]): Action => {
                    console.log("happened");
                    if (covid.type === "success" && population.type === "success") {
                        return { type: "fetch-success", response: mergeCovidPopulation(covid.data, population.data) };
                    } else {
                        return { type: "error-during-fetch", message: `Error: ${covid} or ${population} failed to fetch` };
                    }
                }));
};

export const rootEpic = combineEpics(
    startLoadingEpic
);