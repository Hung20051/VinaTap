"use client";

import { useEffect } from "react";

export default function GoogleAdSlot({
  slot = "",
  format = "auto",
  responsive = "true",
  style = { display: "block", minHeight: "100px", margin: "20px 0" },
  className = ""
}) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.warn("Google AdSense push error:", err);
    }
  }, []);

  return (
    <div className={`google-ad-wrapper ${className}`} style={{ textAlign: "center", overflow: "hidden" }}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-7715734145505240"
        data-ad-slot={slot || undefined}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
