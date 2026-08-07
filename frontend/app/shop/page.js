import { Suspense } from "react";
import ShopPage from "./ShopPage";

export const metadata = {
  title: "Cửa Hàng Thẻ NFC VinaTap — Mua Thẻ & Combo 34 Tỉnh Thành",
  description:
    "Đặt mua Thẻ NFC Mảnh Ghép Gỗ 3D, Thẻ Kim Loại VIP và Combo 34 Tỉnh Thành Việt Nam chính hãng VinaTap.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="admin-dash-loading"><div className="spinner" /></div>}>
      <ShopPage />
    </Suspense>
  );
}
