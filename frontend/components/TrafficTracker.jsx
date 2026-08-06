"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { analyticsAPI } from "@/lib/api";

export default function TrafficTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    // Bỏ qua trang admin không đếm vào lưu lượng khách
    if (!pathname || pathname.startsWith("/admin")) return;

    // Tránh gửi trùng lặp trên cùng 1 path trong 1 lần render
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    // Trích xuất province_slug nếu path dạng /province/:slug hoặc /t/:token
    let provinceSlug = null;
    if (pathname.startsWith("/province/")) {
      provinceSlug = pathname.replace("/province/", "").split("?")[0];
    }

    analyticsAPI.track(pathname, provinceSlug).catch(() => {});
  }, [pathname]);

  return null;
}
