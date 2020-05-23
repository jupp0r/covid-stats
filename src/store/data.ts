import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { fromCSV, IDataFrame, Series } from "data-forge";

interface CovidRow {
  iso_code: string;
}

interface PopulationRow {
  iso_code: string;
  population: string;
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

export const parseUsCSV = (data: string): Observable<IDataFrame> =>
  of(fromCSV(data)).pipe(
    map((df: IDataFrame): IDataFrame => df.parseDates("date")),
  );

export const parseUsStateInfoCSV = (data: string): Observable<IDataFrame> =>
  of(fromCSV(data));

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
  stateInfo: IDataFrame
): IDataFrame => {
  const populationLatest = computeLatestPopulation(population);
  return covid.join(
    populationLatest,
    (covid: CovidRow) => covid.iso_code,
    (pop: PopulationRow) => pop.iso_code,
    (covid: CovidRow, pop: PopulationRow | null) => ({
      ...covid,
      population: pop ? pop.population : 0,
    }),
  );
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
