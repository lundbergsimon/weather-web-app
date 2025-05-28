import { createContext, useState } from "react";
import PopUp from "../components/PopUp";

type PopUpContextType = {
  isPopUpOpen: boolean;
  displayPopUp: (newMessage: string) => void;
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

  const displayPopUp = (newMessage: string) => {
    setMessage(newMessage);
    setIsPopUpOpen(true);
    setInterval(() => {
      setIsPopUpOpen(false);
      setMessage(DEFAULT_MESSAGE);
    }, 3000);
  };

  return (
    <PopUpContext.Provider
      value={{
        isPopUpOpen,
        displayPopUp
      }}
    >
      <PopUp isOpen={isPopUpOpen} message={message} />
      {children}
    </PopUpContext.Provider>
  );
};

export default PopUpContext;
