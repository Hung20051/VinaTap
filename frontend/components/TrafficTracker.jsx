"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { analyticsAPI, getBaseUrl } from "../lib/api";
import { getUser } from "../lib/auth";

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 phút không hoạt động hoặc qua ngày mới

export default function TrafficTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    // 1. Bỏ qua trang Admin
    if (!pathname || pathname.startsWith("/admin")) {
      return;
    }

    // 2. Bỏ qua tài khoản Admin (kể cả khi xem trang public)
    const user = getUser();
    if (user?.role === "admin") {
      console.log("ℹ️ [TrafficTracker] Bỏ qua đếm do tài khoản là Admin:", pathname);
      return;
    }

    // Tránh gửi lặp lại trong 1 render
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    const now = Date.now();
    const isNfcTap = pathname.startsWith("/t/");
    const lastVisitKey = "vinatap_last_session_time";
    const lastVisitTime = localStorage.getItem(lastVisitKey);

    let isNewSession = false;
    if (!lastVisitTime || now - parseInt(lastVisitTime, 10) > SESSION_TIMEOUT_MS) {
      isNewSession = true;
    }

    // Cập nhật thời điểm hoạt động gần nhất
    localStorage.setItem(lastVisitKey, now.toString());

    // CHỈ ĐẾM LƯỢT XEM KHI:
    // A. Quét thẻ NFC (/t/[token]) -> Luôn đếm +1
    // B. Khách mở web ở Phiên Truy Cập Mới (Khách mới / Sáng hôm sau quay lại) -> Đếm +1
    if (!isNfcTap && !isNewSession) {
      console.log("ℹ️ [TrafficTracker] Đang trong phiên 30 phút (Chuyển trang nội bộ) -> Không đếm lặp:", pathname);
      return;
    }

    // Trích xuất province_slug nếu path dạng /province/:slug hoặc /t/:token
    let provinceSlug = null;
    if (pathname.startsWith("/province/")) {
      provinceSlug = pathname.replace("/province/", "").split("?")[0].split("#")[0];
    }

    const apiUrl = getBaseUrl();
    const reason = isNfcTap ? "Quét thẻ NFC" : "Phiên truy cập mới (Khách mới/Sáng hôm sau)";
    console.log(`🚀 [TrafficTracker] +1 Lượt xem [${pathname}] (${reason}) tới API: ${apiUrl}`);

    analyticsAPI
      .track(pathname, provinceSlug)
      .then((res) => {
        console.log(`✅ [TrafficTracker] Ghi nhận +1 Lượt xem THÀNH CÔNG cho [${pathname}]:`, res);
      })
      .catch((err) => {
        console.error(`❌ [TrafficTracker] LỖI GỬI LƯỢT XEM [${pathname}]:`, err?.message || err);
      });
  }, [pathname]);

  return null;
}
