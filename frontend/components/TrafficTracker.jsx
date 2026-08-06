"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { analyticsAPI, getBaseUrl } from "../lib/api";

export default function TrafficTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    // Bỏ qua trang admin không đếm vào lưu lượng khách
    if (!pathname || pathname.startsWith("/admin")) {
      console.log("ℹ️ [TrafficTracker] Bỏ qua đếm trang Admin:", pathname);
      return;
    }

    lastTrackedPath.current = pathname;

    // Trích xuất province_slug nếu path dạng /province/:slug hoặc /t/:token
    let provinceSlug = null;
    if (pathname.startsWith("/province/")) {
      provinceSlug = pathname.replace("/province/", "").split("?")[0].split("#")[0];
    }

    const apiUrl = getBaseUrl();
    console.log(`🚀 [TrafficTracker] Đang gửi lượt xem [${pathname}] tới API: ${apiUrl}`);

    analyticsAPI
      .track(pathname, provinceSlug)
      .then((res) => {
        console.log(`✅ [TrafficTracker] Ghi nhận lượt xem THÀNH CÔNG cho [${pathname}]:`, res);
      })
      .catch((err) => {
        console.error(`❌ [TrafficTracker] LỖI GỬI LƯỢT XEM [${pathname}]:`, err?.message || err);
      });
  }, [pathname]);

  return null;
}
