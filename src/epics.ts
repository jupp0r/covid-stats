import { Observable, zip, merge } from "rxjs";

import { filter, flatMap, map } from "rxjs/operators";

import { Action, makeProgressAction, ProgressAction } from "./actions";

import { combineEpics } from "redux-observable";

import {
  parseCovidCSV,
  parsePopulationCSV,
  mergeCovidPopulation,
} from "./data";
import { IDataFrame } from "data-forge";

type DataResult =
  | { type: "success"; data: IDataFrame }
  | { type: "error"; reason: string };

interface Progress {
  done: number;
  total: number;
}

const fromXhr = (
  url: string,
): {
  progress: Observable<Progress>;
  result: Observable<string>;
} => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "text";
  const progress$ = new Observable<Progress>((subscriber): void => {
    xhr.addEventListener("progress", ev =>
      subscriber.next({
        done: ev.loaded,
        total: ev.total,
      }),
    );
  });

  const result$ = new Observable<string>(subscriber => {
    xhr.addEventListener("readystatechange", ev => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status === 200) {
        subscriber.next(xhr.response);
        subscriber.complete();
      } else {
        subscriber.error(xhr.response);
      }
    });
  });

  xhr.open("GET", url);
  xhr.send();
  return { progress: progress$, result: result$ };
};

export const startLoadingEpic = (
  action$: Observable<Action>,
): Observable<Action> => {
  const covidData$: Observable<ProgressAction | DataResult> = action$.pipe(
    filter((action: Action) => action.type === "initialized"),
    flatMap(() => {
      const { progress, result } = fromXhr(
        "https://covid.ourworldindata.org/data/owid-covid-data.csv",
      );
      const progress$ = progress.pipe(
        map((update: Progress) =>
          makeProgressAction({ ...update, target: "covid" }),
        ),
      );

      const result$ = result.pipe(
        flatMap(parseCovidCSV),
        map((data: IDataFrame): DataResult => ({ type: "success", data })),
      );

      return merge(progress$, result$);
    }),
  );

  const populationData$: Observable<ProgressAction | DataResult> = action$.pipe(
    filter((action: Action) => action.type === "initialized"),
    flatMap(() => {
      const { progress, result } = fromXhr(
        "https://raw.githubusercontent.com/datasets/population/master/data/population.csv",
      );
      const progress$ = progress.pipe(
        map((update: Progress) =>
          makeProgressAction({ ...update, target: "population" }),
        ),
      );

      const result$ = result.pipe(
        flatMap(parsePopulationCSV),
        map((data: IDataFrame): DataResult => ({ type: "success", data })),
      );

      return merge(progress$, result$);
    }),
  );

  const combinedProgress$: Observable<ProgressAction> = merge(
    covidData$,
    populationData$,
  ).pipe(
    filter(item => item.type === "progress"),
    map(item => item as ProgressAction),
  );

  const filterForResult = (data$: Observable<ProgressAction | DataResult>) =>
    data$.pipe(filter(item => item.type === "success"));

  const combinedResults$: Observable<Action> = zip(
    filterForResult(covidData$),
    filterForResult(populationData$),
  ).pipe(
    map(
      ([covid, population]): Action => {
        console.log("happened");
        if (covid.type === "success" && population.type === "success") {
          return {
            type: "fetch-success",
            response: mergeCovidPopulation(covid.data, population.data),
          };
        } else {
          return {
            type: "error-during-fetch",
            message: `Error: ${covid} or ${population} failed to fetch`,
          };
        }
      },
    ),
  );

  return merge(combinedProgress$, combinedResults$);
};

export const rootEpic = combineEpics(startLoadingEpic);
