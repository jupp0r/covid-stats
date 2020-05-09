import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { fromCSV, IDataFrame, Series } from 'data-forge';

interface CovidRow {
    iso_code: string,
}

interface PopulationRow {
    "iso_code": string,
    "population": string,
    "year": number,
}

export const parseCovidCSV = (data: string): Observable<IDataFrame> =>
    of(fromCSV(data))
        .pipe(
            map((df: IDataFrame): IDataFrame => df.parseDates('date')),
            map((df: IDataFrame): IDataFrame => df.parseInts('total_cases')),
        );

export const parsePopulationCSV = (data: string): Observable<IDataFrame> =>
    of(fromCSV(data))
        .pipe(
            map(
                (df: IDataFrame): IDataFrame => df.parseInts(['Value', 'Year'])
            ),
            map((df: IDataFrame): IDataFrame => df.renameSeries({
                "Year": "year",
                "Country Code": "iso_code",
                "Value": "population",
            }))
        );

export const transformCsvData = (data: IDataFrame): IDataFrame => data;

type Maximums = Map<string, number>;

type Accumulator = {
    maximums: Maximums,
    result: IDataFrame,
}

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
        }).inflate();

export const mergeCovidPopulation = (covid: IDataFrame, population: IDataFrame): IDataFrame => {
    const populationLatest = computeLatestPopulation(population);
    console.log(populationLatest.toArray());
    return covid.join(
        populationLatest,
        (covid: CovidRow) => covid.iso_code,
        (pop: PopulationRow) => pop.iso_code,
        (covid: CovidRow, pop: PopulationRow | null) => (
            {
                ...covid,
                population: pop ? pop.population : 0
            }
        )
    );
};
