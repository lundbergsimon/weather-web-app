import { useQuery } from "@tanstack/react-query";
import ForecastTable from "../components/ForecastTable";
import useApi from "../hooks/useApi";
import { ForecastData } from "../types";

export default function HomePage() {
  const axiosInstance = useApi();

  const { data: forecast, isLoading } = useQuery({
    queryKey: ["forecast"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "/forecast?lon=18.063240&lat=59.334591"
      );
      if (response.status !== 200) {
        throw new Error("Error fetching forecast data");
      }
      const forecastData = response.data.data as ForecastData[];
      const forecastMap = new Map<number, ForecastData[]>();
      forecastData.forEach((item) => {
        const date = new Date(item.datetime).getDate();
        if (forecastMap.has(date)) {
          forecastMap.get(date)?.push(item);
        } else {
          forecastMap.set(date, [item]);
        }
      });
      return forecastMap;
    }
  });

  return (
    <div className="">
      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      )}
      {forecast && (
        <div className="flex justify-center items-center">
          <div className="inline-flex flex-col justify-center items-center gap-4 py-4">
            {Array.from(forecast.entries()).map(([key, value]) => (
              <div key={key}>
                <h1 className="text-2xl font-bold text-center">
                  {new Date(value[0].datetime).toDateString()}
                </h1>
                <ForecastTable timeSeries={value} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
