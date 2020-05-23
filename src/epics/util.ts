import { Observable, merge } from "rxjs";
import { filter, flatMap, map } from "rxjs/operators";
import { IDataFrame } from "data-forge";
import { Action, ProgressAction, makeProgressAction, DownloadCategory } from "../actions";

export type DataResult =
  | { type: "success"; data: IDataFrame }
  | { type: "error"; reason: string };

export interface Progress {
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

export const makeProgressStream = (
  action$: Observable<Action>,
  url: string,
  csvParser: (data: string) => Observable<IDataFrame>,
  target: DownloadCategory,
): Observable<ProgressAction | DataResult> =>
  action$.pipe(
    filter((action: Action) => action.type === "initialized"),
    flatMap(() => {
      const { progress, result } = fromXhr(url);
      const progress$ = progress.pipe(
        map((update: Progress) =>
          makeProgressAction({ ...update, target }),
        ),
      );

      const result$ = result.pipe(
        flatMap(csvParser),
        map((data: IDataFrame): DataResult => ({ type: "success", data })),
      );

      return merge(progress$, result$);
    }),
  );
