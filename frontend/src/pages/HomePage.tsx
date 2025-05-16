import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import useApi from "../hooks/useApi";
import { ForecastData } from "../types";

export default function HomePage() {
  const axiosInstance = useApi();
  const [forecast, setForecast] = useState<Array<ForecastData> | null>(null);

  const sendForecastRequest = async () => {
    const response = await axiosInstance.get(
      "/forecast?lon=18.063240&lat=59.334591"
    );
    if (response.status !== 200) {
      throw new Error("Error fetching forecast data");
    }
    console.log(response.data);

    setForecast(response.data.data);
  };

  const { mutateAsync: getForecast } = useMutation({
    mutationFn: sendForecastRequest
  });

  const handleClick = async () => {
    await getForecast();
  };

  return (
    <div className="w-screen">
      <button type="button" onClick={handleClick}>
        Click Me
      </button>
      {forecast && (
        <div className="flex gap-4 flex-wrap">
          {forecast.map((item: ForecastData, index: number) => (
            <div key={index} className="bg-zinc-800 p-4 rounded-md border border-zinc-700">
              {/* <p>Date: {item.datetime}</p> */}
              <h1>{item.temperature.values[0]} {"\u2103"}</h1>
              <p>Wind Speed: {item.windSpeed.values} {item.windSpeed.unit}</p>
              <p>Wind Direction: {item.windDirection.values[0]} {item.windDirection.unit}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
