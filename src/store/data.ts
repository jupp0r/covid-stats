import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { fromCSV, IDataFrame, Series } from "data-forge";

export interface Row {
  date: Date;
  iso_code: string;
  location: string;
  total_cases: number;
  new_cases: number;
  total_deaths: number;
  new_deaths: number;
  total_tests: number;
  new_tests: number;
  population: number;
  location_type: "country" | "us-state";
}

interface CovidRow {
  date: Date;
  iso_code: string;
  location: string;
  total_cases: number;
  new_cases: number;
  total_deaths: number;
  new_deaths: number;
  total_tests: number;
  new_tests: number;
}

interface PopulationRow {
  iso_code: string;
  population: number;
  year: number;
}

export const parseCovidCSV = (data: string): Observable<IDataFrame> =>
  of(fromCSV(data)).pipe(
    map((df: IDataFrame): IDataFrame => df.parseDates("date")),
    map((df: IDataFrame): IDataFrame => df.parseInts("total_cases")),
    map((df: IDataFrame): IDataFrame => df.parseInts("new_cases")),
    map((df: IDataFrame): IDataFrame => df.parseInts("total_deaths")),
    map((df: IDataFrame): IDataFrame => df.parseInts("new_deaths")),
    map((df: IDataFrame): IDataFrame => df.parseInts("total_tests")),
    map((df: IDataFrame): IDataFrame => df.parseInts("new_tests")),
  );

export const parsePopulationCSV = (data: string): Observable<IDataFrame> =>
  of(fromCSV(data)).pipe(
    map((df: IDataFrame): IDataFrame => df.parseInts(["Value", "Year"])),
    map(
      (df: IDataFrame): IDataFrame =>
        df.renameSeries({
          Year: "year",
          "Country Code": "iso_code",
          Value: "population",
        }),
    ),
  );

const replaceEmptyBy0 = (field: string): string => (field === "" ? "0" : field);

export const parseUsCSV = (data: string): Observable<IDataFrame> =>
  of(fromCSV(data)).pipe(
    map((df: IDataFrame): IDataFrame => df.parseDates("date", "YYYYMMDD")),
    map(
      (df: IDataFrame): IDataFrame =>
        df.renameSeries({
          state: "iso_code",
          positive: "total_cases",
          positiveIncrease: "new_cases",
          death: "total_deaths",
          deathIncrease: "new_deaths",
          totalTestResults: "total_tests",
          totalTestResultsIncrease: "new_tests",
        }),
    ),
    map(
      (df: IDataFrame): IDataFrame =>
        df.transformSeries({
          total_cases: replaceEmptyBy0,
          new_cases: replaceEmptyBy0,
          total_deaths: replaceEmptyBy0,
          new_deaths: replaceEmptyBy0,
          total_tests: replaceEmptyBy0,
          new_tests: replaceEmptyBy0,
        }),
    ),
    map(
      (df: IDataFrame): IDataFrame =>
        df.parseInts([
          "total_cases",
          "new_cases",
          "total_deaths",
          "new_deaths",
          "total_tests",
          "new_tests",
        ]),
    ),
  );

export const parseUsStateInfoCSV = (data: string): Observable<IDataFrame> =>
  of(fromCSV(data)).pipe(
    map((df: IDataFrame): IDataFrame => df.parseInts("population")),
  );

export const transformCsvData = (data: IDataFrame): IDataFrame => data;

type Maximums = Map<string, number>;

type Accumulator = {
  maximums: Maximums;
  result: IDataFrame;
};

const computeLatestPopulation = (population: IDataFrame): IDataFrame =>
  population
    .groupBy(row => row.iso_code)
    .select(group => {
      const { year: maxYear } = group.summarize({ year: Series.max });
      const pop = group.where(row => row.year === maxYear).first().population;
      return {
        iso_code: group.first().iso_code,
        population: pop,
      };
    })
    .inflate();

export const mergeData = (
  covid: IDataFrame,
  population: IDataFrame,
  us: IDataFrame,
  stateInfo: IDataFrame,
): IDataFrame<number, Row> => {
  const populationLatest = computeLatestPopulation(population);

  const joinedUsData: IDataFrame<number, Row> = us.join(
    stateInfo,
    row => row.iso_code,
    row => row.code,
    (dataRow, infoRow) => ({
      ...dataRow,
      location: infoRow ? infoRow.state : "unknown location name",
      population: infoRow.population,
      location_type: "us-state",
    }),
  );

  const joinedWorldData: IDataFrame<number, Row> = covid.join(
    populationLatest,
    (covid: CovidRow) => covid.iso_code,
    (pop: PopulationRow) => pop.iso_code,
    (covid: CovidRow, pop: PopulationRow | null) => ({
      ...covid,
      population: pop ? pop.population : 0,
      location_type: "country",
    }),
  );

  const combined = joinedUsData.concat(joinedWorldData);

  return combined;
};

export const smooth = (amount: number, series: number[][]): number[][] => {
  amount = Math.ceil(Math.abs(amount));
  let results: Array<Array<number>> = [];
  for (let i = 0; i < series.length; i++) {
    let [x] = series[i];

    let valuesInAverage = 0;
    let sum = 0;
    for (let j = amount * -1; j <= amount; j++) {
      if (series[i + j] === undefined) {
        // ignore edges
        continue;
      }

      sum = sum + series[i + j][1];
      valuesInAverage = valuesInAverage + 1;
    }

    results.push([x, sum / valuesInAverage]);
  }
  return results;
};
