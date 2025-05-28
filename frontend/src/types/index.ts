export type ForecastData = {
  datetime: string;
  temperature: { values: Array<number>; unit: string };
  windSpeed: { values: Array<number>; unit: string };
  windDirection: { values: Array<number>; unit: string };
};