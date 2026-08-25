"use client";

import { useState, useEffect } from "react";
import { Lottie } from "lottie-react";
import dinoLoadingData from "@/public/animations/DinoLoading.json";

/**
 * DinoLoader - Component hiển thị hoạt hình Khủng long Dino chạy lúc loading
 * @param {string} text - Dòng chữ thông báo chính
 * @param {string} subtext - Dòng chữ mô tả phụ
 * @param {number|string} size - Kích thước animation (mặc định 260px)
 * @param {boolean} fullScreen - Nếu true thì căn giữa phủ kín toàn màn hình (mặc định: true)
 */
export default function DinoLoader({
  text = "Đang tải dữ liệu VinaTap...",
  subtext = "Vui lòng chờ trong giây lát",
  size = 260,
  fullScreen = true,
  className = "",
  style = {},
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const widthStyle = typeof size === "number" ? `${size}px` : size;

  const content = (
    <div
      className={`select-none ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "1.5rem",
        ...style,
      }}
    >
      {/* Khung animation */}
      <div
        style={{
          width: widthStyle,
          maxWidth: "90vw",
          minHeight: typeof size === "number" ? `${Math.round(size * 0.55)}px` : "140px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {mounted ? (
          <Lottie
            src={dinoLoadingData}
            loop={true}
            autoplay={true}
            style={{ width: "100%", height: "auto" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "120px",
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              borderRadius: "16px",
            }}
          />
        )}
      </div>

      {/* Chữ thông báo */}
      {text && (
        <p
          style={{
            marginTop: "1rem",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#065f46",
            letterSpacing: "0.025em",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        >
          {text}
        </p>
      )}

      {subtext && (
        <p
          style={{
            marginTop: "0.25rem",
            fontSize: "0.85rem",
            color: "#64748b",
            maxWidth: "320px",
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        {content}
      </div>
    );
  }

  return content;
}
