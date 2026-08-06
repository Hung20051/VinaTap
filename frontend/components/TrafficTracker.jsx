"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { analyticsAPI, getBaseUrl } from "../lib/api";
import { getUser } from "../lib/auth";

export default function TrafficTracker() {
  const pathname = usePathname();
  const lastTracked = useRef({ path: null, time: 0 });

  useEffect(() => {
    // 1. Bỏ qua nếu là trang Admin (/admin/...)
    if (!pathname || pathname.startsWith("/admin")) {
      return;
    }

    // 2. Bỏ qua nếu người dùng hiện tại là tài khoản Admin (kể cả khi xem trang public)
    const user = getUser();
    if (user?.role === "admin") {
      console.log("ℹ️ [TrafficTracker] Bỏ qua đếm vì tài khoản là Admin:", pathname);
      return;
    }

    // 3. Tránh gửi trùng lặp trên cùng 1 path trong vòng 3 giây (chống React Double Render)
    const now = Date.now();
    if (
      lastTracked.current.path === pathname &&
      now - lastTracked.current.time < 3000
    ) {
      return;
    }
    lastTracked.current = { path: pathname, time: now };

    // Trích xuất province_slug nếu path dạng /province/:slug
    let provinceSlug = null;
    if (pathname.startsWith("/province/")) {
      provinceSlug = pathname.replace("/province/", "").split("?")[0].split("#")[0];
    }

    const apiUrl = getBaseUrl();
    console.log(`🚀 [TrafficTracker] +1 Lượt xem [${pathname}] tới API: ${apiUrl}`);

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
