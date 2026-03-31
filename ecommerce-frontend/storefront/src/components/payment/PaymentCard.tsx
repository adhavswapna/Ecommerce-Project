import PaymentStatusBadge from "./PaymentStatusBadge";
import { Payment } from "@/hooks/usePayments";

interface Props {
  payment: Payment;
}

export default function PaymentCard({ payment }: Props) {
  return (
    <div className="border rounded p-4 flex justify-between items-center shadow-sm">
      <div>
        <p className="font-semibold">Order: {payment.orderId}</p>
        <p className="text-sm text-gray-500">
          {new Date(payment.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="text-right space-y-1">
        <p className="font-semibold">${payment.amount.toFixed(2)}</p>
        <PaymentStatusBadge status={payment.status} />
      </div>
    </div>
  );
}
