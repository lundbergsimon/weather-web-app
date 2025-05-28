import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ForecastTable from "../components/ForecastTable";
import useApiPrivate from "../hooks/useApiPrivate";
import usePopUp from "../hooks/usePopUp";
import { ForecastData } from "../types";

/**
 * The HomePage component fetches and displays weather forecast data based on the user's
 * current geolocation. It uses the `useApiPrivate` hook to make authenticated API requests
 * to retrieve forecast data. The component checks if geolocation is supported by the browser
 * and displays a pop-up message if it's not supported. It stores the user's coordinates in
 * state and triggers the fetching of forecast data using the `useQuery` hook once the coordinates
 * are available. The forecast data is grouped by date and rendered in a `ForecastTable` component
 * for each day's data. The component handles loading and error states appropriately.
 */
export default function HomePage() {
  const { apiPrivate } = useApiPrivate();
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const { displayPopUp } = usePopUp();

  useEffect(() => {
    if (!navigator.geolocation) {
      displayPopUp("Geolocation is not supported by this browser.", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
      },
      (error) => {
        console.error(error);
        if (error.code === error.PERMISSION_DENIED) {
          displayPopUp("User denied the request for Geolocation.", "error");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          displayPopUp("Location information is unavailable.", "error");
        } else if (error.code === error.TIMEOUT) {
          displayPopUp("The request to get user location timed out.", "error");
        } else {
          displayPopUp("An unknown error occurred.", "error");
        }
      }
    );
  }, []);

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
      displayPopUp("Successfully fetched forecast data", "success");
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
