import { FaArrowDownLong } from "react-icons/fa6";
import { ForecastData } from "../types";

interface ForecastTableProps {
  timeSeries: ForecastData[];
}

const ForecastTable: React.FC<ForecastTableProps> = ({ timeSeries }) => {
  return (
    <table className="border-separate border-spacing-2 border border-gray-400 dark:border-gray-500 w-full">
      <thead>
        <tr>
          <th>Day</th>
          <th>Temperature</th>
          <th>Wind Speed</th>
          <th>Wind Direction</th>
        </tr>
      </thead>
      <tbody>
        {timeSeries.map((item: ForecastData, index: number) => (
          <tr key={index}>
            <td>{new Date(item.datetime).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false})}</td>
            <td>{item.temperature.values[0]}°C</td>
            <td>{item.windSpeed.values[0]} {item.windSpeed.unit}</td>
            <td><FaArrowDownLong style={{transform: `rotate(${item.windDirection.values[0]}deg)`}} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ForecastTable;