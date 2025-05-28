import { createContext, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PopUp from "../components/PopUp";

type PopUpContextType = {
  isPopUpOpen: boolean;
  displayPopUp: (newMessage: string, type?: "success" | "error") => void;
};

const PopUpContext = createContext<PopUpContextType | undefined>(undefined);

interface PopUpProviderProps {
  children: React.ReactNode;
}

const DEFAULT_MESSAGE = "Something went wrong";

/**
 * A React Context Provider that supplies a context for managing pop-up state and behavior.
 *
 * This provider maintains two state variables: `isPopUpOpen`, which indicates whether the pop-up
 * is currently displayed, and `message`, which represents the message shown in the pop-up.
 *
 * The `displayPopUp` function sets a new message and opens the pop-up for a set duration,
 * after which the pop-up automatically closes and the message resets to a default value.
 *
 * The `PopUpProvider` component wraps its children with the `PopUpContext` and renders the `PopUp`
 * component.
 */
export const PopUpProvider: React.FC<PopUpProviderProps> = ({ children }) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [type, setType] = useState<"success" | "error" | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const displayPopUp = (newMessage: string, type?: "success" | "error") => {
    if (newMessage) {
      setMessage(newMessage);
    }
    setType(type);
    setIsPopUpOpen(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setIsPopUpOpen(false);
      setMessage(DEFAULT_MESSAGE);
    }, 3000);
  };

  const styles = (type: "success" | "error" | undefined) => {
    switch (type) {
      case "success":
        return "bg-green-400 border-green-500 text-black";
      case "error":
        return "bg-red-500 border-red-400";
      default:
        return "bg-zinc-700 border-zinc-600";
    }
  };

  return (
    <PopUpContext.Provider
      value={{
        isPopUpOpen,
        displayPopUp
      }}
    >
      {createPortal(
        <PopUp
          isOpen={isPopUpOpen}
          message={message}
          className={styles(type)}
        />,
        document.getElementById("portal")!
      )}
      {children}
    </PopUpContext.Provider>
  );
};

export default PopUpContext;
