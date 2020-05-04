import { DataFrame } from 'dataframe-js';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export const parseCSV = (data: string): Observable<DataFrame> =>
    from(DataFrame.fromCSV(new File([data], "data.csv")) as Promise<DataFrame>).pipe(
        map((df: DataFrame): DataFrame => df.cast('date', (dateString: string) => Date.parse(dateString))),
        map((df: DataFrame): DataFrame => df.cast('total_cases', Number)),
    ) as Observable<DataFrame>;

export const transformCsvData = (data: DataFrame): DataFrame => {
    return data.filter((row: any) => row.get("iso_code") === "USA");
};