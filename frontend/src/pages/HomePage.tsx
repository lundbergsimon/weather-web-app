import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ForecastTable from "../components/ForecastTable";
import useApiPrivate from "../hooks/useApiPrivate";
import { ForecastData } from "../types";

export default function HomePage() {
  const { apiPrivate } = useApiPrivate();
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, [apiPrivate]);

  const { data: forecast, isLoading } = useQuery({
    queryKey: ["forecast"],
    queryFn: async () => {
      apiPrivate.defaults.params = {
        lon: coords?.longitude.toFixed(6),
        lat: coords?.latitude.toFixed(6)
      };
      const response = await apiPrivate.get("/forecast");
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
    },
    enabled: !!coords,
    refetchOnWindowFocus: false
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
