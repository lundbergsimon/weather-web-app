interface PopUpProps {
  isOpen: boolean;
  message: string;
}

export default function PopUp({ isOpen, message }: PopUpProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed left-0 bottom-0 m-4 z-50 bg-zinc-700 p-4 rounded border border-zinc-600">
      {message}
    </div>
  );
}
