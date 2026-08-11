import CustomerOrders from "./CustomerOrders";

export const metadata = {
  title: "Đơn Hàng Của Tôi — VinaTap",
  description: "Lịch sử và trạng thái đơn hàng thẻ NFC VinaTap của bạn.",
};

export default function Page() {
  return <CustomerOrders />;
}
