interface Props {
  onClick: () => void;
}

export function HiddenAdminButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="admin"
      className="fixed top-3 right-3 w-8 h-8 opacity-0 hover:opacity-10 transition-opacity duration-300 z-40 rounded-full bg-gray-400"
      tabIndex={-1}
    />
  );
}
