"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { analyticsAPI } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function TrafficTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef(null);
  const entryTime = useRef(Date.now());

  // Lấy hoặc tạo session_id ngẫu nhiên trong sessionStorage
  const getSessionId = () => {
    if (typeof window === "undefined") return null;
    let sid = sessionStorage.getItem("vinatap_session_id");
    if (!sid) {
      sid = "sid_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now();
      sessionStorage.setItem("vinatap_session_id", sid);
    }
    return sid;
  };

  useEffect(() => {
    // 1. Bỏ qua trang Admin
    if (!pathname || pathname.startsWith("/admin")) {
      return;
    }

    // 2. Bỏ qua tài khoản Admin (tránh làm sai lệch số liệu thực của khách)
    const user = getUser();
    if (user?.role === "admin") {
      return;
    }

    // Tránh gửi lặp lại trong cùng 1 lần render
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;
    entryTime.current = Date.now();

    if (typeof window === "undefined") return;

    // Trích xuất province_slug nếu path dạng /province/:slug hoặc /provinces/:slug
    let provinceSlug = null;
    if (pathname.startsWith("/province/")) {
      provinceSlug = pathname
        .replace("/province/", "")
        .split("?")[0]
        .split("#")[0]
        .replace(/\/$/, "");
    } else if (pathname.startsWith("/provinces/")) {
      provinceSlug = pathname
        .replace("/provinces/", "")
        .split("?")[0]
        .split("#")[0]
        .replace(/\/$/, "");
    }

    // Trích xuất UTM params
    const searchParams = new URLSearchParams(window.location.search);
    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    const referrer = document.referrer || null;
    const sessionId = getSessionId();

    analyticsAPI
      .track({
        page_path: pathname,
        province_slug: provinceSlug,
        referrer,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        session_id: sessionId,
      })
      .catch(() => {});

    // Gửi heartbeat cập nhật thời gian lưu lại trang (duration_seconds) mỗi 15 giây
    const heartbeatTimer = setInterval(() => {
      const elapsedSec = Math.round((Date.now() - entryTime.current) / 1000);
      if (elapsedSec > 0 && elapsedSec <= 3600) {
        analyticsAPI
          .track({
            page_path: pathname,
            province_slug: provinceSlug,
            session_id: sessionId,
            duration_seconds: elapsedSec,
          })
          .catch(() => {});
      }
    }, 15000);

    const sendExitDuration = () => {
      const elapsedSec = Math.round((Date.now() - entryTime.current) / 1000);
      if (elapsedSec > 2 && elapsedSec <= 3600) {
        analyticsAPI
          .track({
            page_path: pathname,
            province_slug: provinceSlug,
            session_id: sessionId,
            duration_seconds: elapsedSec,
          })
          .catch(() => {});
      }
    };

    window.addEventListener("beforeunload", sendExitDuration);

    // Lắng nghe click tự động vào các link Affiliate/Đối tác (có data-partner hoặc link ra klook/booking/agoda/vinwonders)
    const handleDocumentClick = (e) => {
      const target = e.target.closest("a");
      if (!target || !target.href) return;

      const href = target.href;
      const isExternal =
        href.startsWith("http://") || href.startsWith("https://");
      const isSameHost = href.includes(window.location.hostname);

      let partnerName = target.getAttribute("data-partner");
      if (!partnerName && isExternal && !isSameHost) {
        if (/klook\.com/i.test(href)) partnerName = "klook";
        else if (/booking\.com/i.test(href)) partnerName = "booking";
        else if (/agoda\.com/i.test(href)) partnerName = "agoda";
        else if (/traveloka\.com/i.test(href)) partnerName = "traveloka";
        else if (/vinwonders\.com/i.test(href)) partnerName = "vinwonders";
      }

      if (partnerName) {
        const linkTitle =
          target.getAttribute("data-title") ||
          target.innerText?.trim()?.slice(0, 100) ||
          target.getAttribute("aria-label") ||
          partnerName;

        analyticsAPI
          .trackAffiliate({
            page_path: pathname,
            partner_name: partnerName,
            destination_url: href,
            link_title: linkTitle,
          })
          .catch(() => {});
      }
    };

    document.addEventListener("click", handleDocumentClick, { passive: true });
    return () => {
      clearInterval(heartbeatTimer);
      window.removeEventListener("beforeunload", sendExitDuration);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [pathname]);

  return null;
}
