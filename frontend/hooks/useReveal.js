"use client";

import { useEffect, useRef, useState } from "react";

// Hook dùng chung cho hiệu ứng "hiện dần + trồi nhẹ" khi phần tử cuộn vào
// khung nhìn — dùng IntersectionObserver thuần, không kéo thêm thư viện
// animation (framer-motion...) chỉ để làm 1 hiệu ứng đơn giản này.
// Dùng: const [ref, visible] = useReveal(); rồi gắn className={`reveal ${visible ? "is-visible" : ""}`}
export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Tôn trọng prefers-reduced-motion — hiện luôn, không animate
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}
