interface Props {
  status: "PENDING" | "SUCCESS" | "FAILED";
}

export default function PaymentStatusBadge({ status }: Props) {
  const color =
    status === "SUCCESS"
      ? "bg-green-100 text-green-600"
      : status === "FAILED"
      ? "bg-red-100 text-red-600"
      : "bg-yellow-100 text-yellow-600";

  return (
    <span className={`px-2 py-1 text-xs rounded ${color}`}>
      {status}
    </span>
  );
}
