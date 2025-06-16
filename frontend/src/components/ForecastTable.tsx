import { FaArrowDownLong } from "react-icons/fa6";
import { ForecastData } from "../types";

interface ForecastTableProps {
  timeSeries: ForecastData[];
}

/**
 * A table component that displays the given time series of forecast data.
 * The table has four columns: time, temperature, wind speed, and wind direction.
 * The wind direction is visualized with a rotating arrow icon.
 */
const ForecastTable: React.FC<ForecastTableProps> = ({ timeSeries }) => {
  return (
    <table className="p-2 border-separate border-spacing-2 border-spacing-x-4 border border-zinc-800 w-full bg-gradient-to-b from-secondary to-primary shadow-neutral-900 shadow-lg rounded-2xl">
      <thead>
        <tr>
          <th>Time</th>
          <th>Temperature</th>
          <th>Wind Speed</th>
          <th>Wind Direction</th>
        </tr>
      </thead>
      <tbody>
        {timeSeries.map((item: ForecastData, index: number) => (
          <tr key={index}>
            <td>
              {new Date(item.datetime).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              })}
            </td>
            <td>{item.temperature.values[0]}°C</td>
            <td>
              {item.windSpeed.values[0]} {item.windSpeed.unit}
            </td>
            <td>
              <FaArrowDownLong
                style={{
                  transform: `rotate(${item.windDirection.values[0]}deg)`
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ForecastTable;
