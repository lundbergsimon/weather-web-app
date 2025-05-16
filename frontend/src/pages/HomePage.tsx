import { useMutation } from "@tanstack/react-query";
import useApi from "../hooks/useApi";

export default function HomePage() {
  const axiosInstance = useApi();

  const sendForecastRequest = async () => {
    const response = await axiosInstance.get(
      "/forecast?lon=18.063240&lat=59.334591"
    );
    if (response.status !== 200) {
      throw new Error("Error fetching forecast data");
    }
    return response.data;
  };

  const { mutateAsync: getForecast } = useMutation({
    mutationFn: sendForecastRequest
  });

  const handleClick = async () => {
    await getForecast();
  };

  return (
    <div>
      <button type="button" onClick={handleClick}>
        Click Me
      </button>
    </div>
  );
}
