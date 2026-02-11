export default function OrdersPage() {
  return <div>Orders List Page</div>;
}


export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  return <div>Order Detail: {params.orderId}</div>;
}

