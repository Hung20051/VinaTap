"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { analyticsAPI } from "../lib/api";

export default function TrafficTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    // Bỏ qua trang admin không đếm vào lưu lượng khách
    if (!pathname || pathname.startsWith("/admin")) return;

    // Cho phép đếm lại lượt xem ngay cả khi chuyển trang hoặc quét thẻ
    lastTrackedPath.current = pathname;

    // Trích xuất province_slug nếu path dạng /province/:slug hoặc /t/:token
    let provinceSlug = null;
    if (pathname.startsWith("/province/")) {
      provinceSlug = pathname.replace("/province/", "").split("?")[0].split("#")[0];
    }

    analyticsAPI
      .track(pathname, provinceSlug)
      .then((res) => {
        console.log("📈 PageView Tracked Successfully:", pathname, res);
      })
      .catch((err) => {
        console.error("TrafficTracker error:", err);
      });
  }, [pathname]);

  return null;
}
