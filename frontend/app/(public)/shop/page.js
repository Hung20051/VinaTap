import { Suspense } from "react";
import ShopPage from "./ShopPage";

export const metadata = {
  title: "Cửa Hàng Du Lịch VinaTap — Cẩm Nang & Bản Đồ 63 Tỉnh Thành",
  description:
    "Khám phá Bản Đồ Du Lịch Số, Cẩm Nang Hành Trình và Combo 63 Tỉnh Thành Việt Nam chính hãng VinaTap.",
};

export default function Page() {
  return (
    <Suspense fallback={<div className="admin-dash-loading"><div className="spinner" /></div>}>
      <ShopPage />
    </Suspense>
  );
}
