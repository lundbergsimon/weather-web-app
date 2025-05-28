interface PopUpProps {
  isOpen: boolean;
  message: string;
  className: string;
}

export default function PopUp({ isOpen, message, className }: PopUpProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed left-0 bottom-0 m-4 z-50 p-4 rounded border ${className}`}
    >
      {message}
    </div>
  );
}
