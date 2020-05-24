import { fromCSV, IDataFrame, Series } from "data-forge";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

export interface Row {
  date: Date;
  isoCode: string;
  location: string;
  totalCases: number;
  newCases: number;
  totalDeaths: number;
  newDeaths: number;
  totalTests: number;
  newTests: number;
  population: number;
  locationType: "country" | "us-state";
}

interface CovidRow {
  date: Date;
  isoCode: string;
  location: string;
  totalCases: number;
  newCases: number;
  totalDeaths: number;
  newDeaths: number;
  totalTests: number;
  newTests: number;
}

interface PopulationRow {
  isoCode: string;
  population: number;
  year: number;
}

export const parseCovidCSV = (data: string): Observable<IDataFrame> =>
  of(fromCSV(data)).pipe(
    map((df: IDataFrame): IDataFrame => df.renameSeries({
      "iso_code": "isoCode",
      "total_cases": "totalCases",
      "new_cases": "newCases",
      "total_deaths": "totalCases",
      "new_deaths": "newDeaths",
      "total_tests": "totalTests",
      "new_tests": "newTests",
    })),
    map((df: IDataFrame): IDataFrame => df.parseDates("date")),
    map((df: IDataFrame): IDataFrame => df.parseInts("totalCases")),
    map((df: IDataFrame): IDataFrame => df.parseInts("newCases")),
    map((df: IDataFrame): IDataFrame => df.parseInts("totalDeaths")),
    map((df: IDataFrame): IDataFrame => df.parseInts("newDeaths")),
    map((df: IDataFrame): IDataFrame => df.parseInts("totalTests")),
    map((df: IDataFrame): IDataFrame => df.parseInts("newTests")),
  );

export const parsePopulationCSV = (data: string): Observable<IDataFrame> =>
  of(fromCSV(data)).pipe(
    map((df: IDataFrame): IDataFrame => df.parseInts(["Value", "Year"])),
    map(
      (df: IDataFrame): IDataFrame =>
        df.renameSeries({
          Year: "year",
          "Country Code": "isoCode",
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
          state: "isoCode",
          positive: "totalCases",
          positiveIncrease: "newCases",
          death: "totalDeaths",
          deathIncrease: "newDeaths",
          totalTestResults: "totalTests",
          totalTestResultsIncrease: "newTests",
        }),
    ),
    map(
      (df: IDataFrame): IDataFrame =>
        df.transformSeries({
          totalCases: replaceEmptyBy0,
          newCases: replaceEmptyBy0,
          totalDeaths: replaceEmptyBy0,
          newDeaths: replaceEmptyBy0,
          totalTests: replaceEmptyBy0,
          newTests: replaceEmptyBy0,
        }),
    ),
    map(
      (df: IDataFrame): IDataFrame =>
        df.parseInts([
          "totalCases",
          "newCases",
          "totalDeaths",
          "newDeaths",
          "totalTests",
          "newTests",
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
    .groupBy(row => row.isoCode)
    .select(group => {
      const { year: maxYear } = group.summarize({ year: Series.max });
      const pop = group.where(row => row.year === maxYear).first().population;
      return {
        isoCode: group.first().isoCode,
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
    row => row.isoCode,
    row => row.code,
    (dataRow, infoRow) => ({
      ...dataRow,
      location: infoRow ? infoRow.state : "unknown location name",
      population: infoRow.population,
      locationType: "us-state",
    }),
  );

  const joinedWorldData: IDataFrame<number, Row> = covid.join(
    populationLatest,
    (covid: CovidRow) => covid.isoCode,
    (pop: PopulationRow) => pop.isoCode,
    (covid: CovidRow, pop: PopulationRow | null) => ({
      ...covid,
      population: pop ? pop.population : 0,
      locationType: "country",
    }),
  );

  const combined = joinedUsData.concat(joinedWorldData);

  return combined;
};

export const smooth = (amount: number, series: number[][]): number[][] => {
  amount = Math.ceil(Math.abs(amount));
  const results: Array<Array<number>> = [];
  for (let i = 0; i < series.length; i++) {
    const [x] = series[i];

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
