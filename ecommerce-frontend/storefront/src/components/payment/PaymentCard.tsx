"use client";

interface Props {
  title: string;

  selected: boolean;

  onSelect: () => void;
}

export default function PaymentCard({
  title,
  selected,
  onSelect,
}: Props) {
  return (
    <button
      onClick={onSelect}
      className={`border rounded-xl p-6 w-full text-left transition ${
        selected
          ? "border-black bg-gray-100"
          : "border-gray-200"
      }`}
    >
      <h2 className="font-semibold text-lg">
        {title}
      </h2>
    </button>
  );
}
