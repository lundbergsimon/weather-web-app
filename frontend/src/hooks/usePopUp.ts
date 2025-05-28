import { useContext } from "react";
import PopUpContext from "../context/PopUpProvider";

const usePopUp = () => {
  const context = useContext(PopUpContext);
  if (!context) {
    throw new Error("usePopUp must be used within a PopUpProvider");
  }
  return context;
};

export default usePopUp;
