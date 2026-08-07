"use client";

import { useState, useEffect, useRef } from "react";
import "./DvdBounce.css";

const WARNINGS = [
  "⚠️ HỆ THỐNG CHƯA HOÀN THIỆN",
  "🚫 CHUYỂN TIỀN = MẤT TIỀN",
  "😜 LÊU LÊU ~",
  "🔧 ĐANG PHÁT TRIỂN...",
  "💸 KHÔNG HOÀN TIỀN NHA!",
];

const COLORS = [
  "#ff3e3e", "#ff9500", "#ffcc00", "#4cd964",
  "#5ac8fa", "#007aff", "#5856d6", "#ff2d55",
  "#e91e9c", "#00e5ff",
];

export default function DvdBounce() {
  const boxRef = useRef(null);
  const posRef = useRef({ x: 40, y: 80 });
  const velRef = useRef({ dx: 2, dy: 1.5 });
  const [color, setColor] = useState(COLORS[0]);
  const [text, setText] = useState(WARNINGS[0]);
  const animRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const animate = () => {
      const pw = window.innerWidth;
      const ph = window.innerHeight;
      const bw = box.offsetWidth || 240;
      const bh = box.offsetHeight || 60;
      const minY = 65; // Giữ dưới Sticky Header 60px để không che thanh menu

      let { x, y } = posRef.current;
      let { dx, dy } = velRef.current;

      x += dx;
      y += dy;

      let bounced = false;

      // Nảy vào cạnh trái
      if (x <= 0) {
        x = 0;
        dx = Math.abs(dx);
        bounced = true;
      }
      // Nảy vào cạnh phải màn hình
      if (x + bw >= pw) {
        x = Math.max(0, pw - bw);
        dx = -Math.abs(dx);
        bounced = true;
      }
      // Nảy vào cạnh trên (dưới header)
      if (y <= minY) {
        y = minY;
        dy = Math.abs(dy);
        bounced = true;
      }
      // Nảy vào cạnh dưới màn hình
      if (y + bh >= ph) {
        y = Math.max(minY, ph - bh);
        dy = -Math.abs(dy);
        bounced = true;
      }

      if (bounced) {
        setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
        setText(WARNINGS[Math.floor(Math.random() * WARNINGS.length)]);
      }

      posRef.current = { x, y };
      velRef.current = { dx, dy };

      box.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="dvd-bounce-box" ref={boxRef} style={{ borderColor: color }}>
      <div className="dvd-text" style={{ color }}>
        {text}
      </div>
      <div className="dvd-sub">Hệ thống đang trong giai đoạn thử nghiệm</div>
    </div>
  );
}
