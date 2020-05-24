import { Observable, zip, merge } from "rxjs";

import { filter, map } from "rxjs/operators";

import { ofType } from 'redux-observable';

import { Action, ProgressAction } from "../actions";

import { combineEpics } from "redux-observable";

import {
  parseCovidCSV,
  parsePopulationCSV,
  parseUsCSV,
  parseUsStateInfoCSV,
  mergeData,
} from "../store/data";
import { makeProgressStream, DataResult } from "./util";

export const startLoadingEpic = (
  action$: Observable<Action>,
): Observable<Action> => {
  const covidData$ = makeProgressStream(
    action$,
    "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv",
    parseCovidCSV,
    "covid",
  );

  const populationData$ = makeProgressStream(
    action$,
    "https://raw.githubusercontent.com/datasets/population/master/data/population.csv",
    parsePopulationCSV,
    "population"
  );

  const usData$ = makeProgressStream(
    action$,
    "https://covidtracking.com/api/v1/states/daily.csv",
    parseUsCSV,
    "us",
  );

  const stateInfo$ = makeProgressStream(
    action$,
    "https://raw.githubusercontent.com/CivilServiceUSA/us-states/master/data/states.csv",
    parseUsStateInfoCSV,
    "stateInfo",
  );

  const combinedProgress$: Observable<ProgressAction> = merge(
    covidData$,
    populationData$,
    usData$,
    stateInfo$,
  ).pipe(
    ofType("progress"),
  );

  const filterForResult = (data$: Observable<ProgressAction | DataResult>) =>
    data$.pipe(filter(item => item.type === "success"));

  const combinedResults$: Observable<Action> = zip(
    filterForResult(covidData$),
    filterForResult(populationData$),
    filterForResult(usData$),
    filterForResult(stateInfo$),
  ).pipe(
    map(
      ([covid, population, us, stateInfo]): Action => {
        if (
          covid.type === "success" &&
          population.type === "success" &&
          us.type === "success" &&
          stateInfo.type === "success"
        ) {
          return {
            type: "fetch-success",
            response: mergeData(covid.data, population.data, us.data, stateInfo.data),
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
