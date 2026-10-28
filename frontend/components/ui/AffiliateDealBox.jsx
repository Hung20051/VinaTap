"use client";

import { Sparkles, ExternalLink } from "lucide-react";
import { analyticsAPI } from "@/lib/api";
import "@/styles/guide-editorial.css";

export default function AffiliateDealBox({ deal, lang = "vi" }) {
  if (!deal) return null;
  const isVi = lang === "vi";
  const isKlook = deal.partnerType === "klook";
  const partnerBorderColor = isKlook ? "#ff5722" : "#0194f3";

  const handleDealClick = () => {
    try {
      analyticsAPI
        .trackAffiliate({
          page_path:
            typeof window !== "undefined" ? window.location.pathname : "/",
          partner_name: deal.partnerType || deal.partner || "klook",
          destination_url: deal.url,
          link_title: isVi ? deal.title : deal.titleEn,
        })
        .catch(() => {});

      const current = Number(
        localStorage.getItem("vinatap_affiliate_clicks") || "0"
      );
      localStorage.setItem("vinatap_affiliate_clicks", String(current + 1));
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("vinatap:affiliate-clicked", { detail: deal })
        );
      }
    } catch (e) {
      console.warn("Affiliate click track error:", e);
    }
  };

  return (
    <div
      className="guide-affiliate-deal"
      style={{
        borderLeftColor: partnerBorderColor,
        margin: "1.35rem 0",
      }}
    >
      <div className="guide-affiliate-deal__content">
        <div className="guide-affiliate-deal__top">
          <div
            className="guide-affiliate-deal__badge"
            style={{
              backgroundColor: partnerBorderColor,
            }}
          >
            <Sparkles size={12} />
            <span>{isVi ? deal.badge : deal.badgeEn}</span>
          </div>
          <span className="guide-affiliate-deal__partner">
            {isVi ? "Đối tác chính thức" : "Official Partner"}:{" "}
            <strong style={{ color: partnerBorderColor }}>
              {deal.partner}
            </strong>
          </span>
        </div>
        <h5 className="guide-affiliate-deal__title">
          {isVi ? deal.title : deal.titleEn}
        </h5>
        <p className="guide-affiliate-deal__note">
          {isVi ? deal.note : deal.noteEn}
        </p>
      </div>
      <div className="guide-affiliate-deal__action">
        <a
          href={deal.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleDealClick}
          className="guide-affiliate-deal__cta"
          style={{
            background: isKlook
              ? "linear-gradient(135deg, #ff5722 0%, #ff7043 100%)"
              : "linear-gradient(135deg, #0194f3 0%, #00b4d8 100%)",
            boxShadow: isKlook
              ? "0 4px 14px rgba(255, 87, 34, 0.32)"
              : "0 4px 14px rgba(1, 148, 243, 0.32)",
          }}
        >
          <span>{isVi ? deal.ctaText : deal.ctaTextEn}</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}

