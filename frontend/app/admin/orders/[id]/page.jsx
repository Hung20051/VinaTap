import AdminOrderDetail from "./AdminOrderDetail";

export const metadata = {
  title: "Chi Tiết Đơn Hàng Admin — VinaTap",
  description: "Quản lý và xử lý chi tiết đơn hàng VinaTap Shop Online",
};

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  return <AdminOrderDetail orderId={id} />;
}
