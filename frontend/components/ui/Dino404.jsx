"use client";

import { useState, useEffect } from "react";
import { Lottie } from "lottie-react";
import dino404Data from "@/public/animations/dino404.json";

/**
 * Dino404 - Component hoạt hình khủng long cho trang 404 Not Found
 */
export default function Dino404({ size = 680, className = "" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const widthStyle = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      style={{ width: "100%", maxWidth: widthStyle, margin: "0 auto" }}
      className={`flex flex-col items-center justify-center select-none ${className}`}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {mounted ? (
          <Lottie
            src={dino404Data}
            loop={true}
            autoplay={true}
            style={{ width: "100%", height: "auto", maxHeight: "55vh" }}
          />
        ) : (
          <div className="w-full h-48 animate-pulse bg-slate-100/60 rounded-2xl" />
        )}
      </div>
    </div>
  );
}
