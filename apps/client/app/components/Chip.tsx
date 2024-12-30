interface ChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export const Chip = ({ label, isSelected, onClick }: ChipProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium ${isSelected
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
    >
      {label}
    </button>
  );
};
