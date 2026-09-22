"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/**
 * BrandLoader (formerly DinoLoader)
 * Modern, elegant branded loader component for VinaTap
 * Eliminates awkward dinosaur graphics and unifies page transition states
 */
export default function DinoLoader({
  text = "Đang tải dữ liệu...",
  subtext = "",
  size = 56,
  fullScreen = true,
  className = "",
  style = {},
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = (
    <div
      className={`vt-brand-loader select-none ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "1.75rem",
        ...style,
      }}
    >
      {/* ─── Modern Dual-Ring Gradient Spinner with Brand Logo ─── */}
      <div
        style={{
          position: "relative",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer glowing track */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid rgba(13, 148, 136, 0.12)",
          }}
        />
        {/* Rotating active gradient ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "3px solid transparent",
            borderTopColor: "#0d9488",
            borderRightColor: "#0284c7",
            animation: "vtSpin 0.85s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
        />
        {/* Center Logo Icon */}
        <div
          style={{
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "vtPulse 1.8s ease-in-out infinite",
          }}
        >
          <Image
            src="/logo.png"
            alt="VinaTap"
            width={30}
            height={30}
            style={{ width: "auto", height: "24px", objectFit: "contain" }}
            priority
          />
        </div>
      </div>

      {/* ─── Typography ─── */}
      {text && (
        <p
          style={{
            marginTop: "1.1rem",
            fontSize: "0.94rem",
            fontWeight: 600,
            color: "#0f172a",
            letterSpacing: "-0.01em",
            fontFamily: "inherit",
          }}
        >
          {text}
        </p>
      )}

      {subtext && (
        <p
          style={{
            marginTop: "0.25rem",
            fontSize: "0.82rem",
            color: "#64748b",
            maxWidth: "320px",
            fontFamily: "inherit",
          }}
        >
          {subtext}
        </p>
      )}

      <style jsx global>{`
        @keyframes vtSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes vtPulse {
          0%, 100% {
            transform: scale(0.92);
            opacity: 0.85;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }
      `}</style>
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
          backgroundColor: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          animation: "fadeIn 0.15s ease-out",
        }}
      >
        {content}
      </div>
    );
  }

  return content;
}
