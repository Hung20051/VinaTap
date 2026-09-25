"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";

const HANOI_CARD = {
  id: "ha-noi",
  provinceName: "Hà Nội",
  subtitle: "Thủ đô ngàn năm văn hiến • Hồ Gươm",
  accentColor: "#fb923c",
  frontImage: "/cards/mat_trc_hn.jpg",
  backImage: "/cards/mat_sau_hn.jpg",
  cardSerial: "VT-HAN-2026-001",
};

export default function Interactive3DCardShowcase({ lang = "vi" }) {
  const isVi = lang === "vi";
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotation, setRotation] = useState({ x: 8, y: -15 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0.35 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const containerRef = useRef(null);
  const touchStartPos = useRef({ x: 0, y: 0, time: 0 });
  const hasMovedRef = useRef(false);

  useEffect(() => {
    // Nhận biết thiết bị cảm ứng
    if (typeof window !== "undefined") {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);

      // Hỗ trợ cảm biến con quay hồi chuyển trên điện thoại (Gyroscope Tilt)
      const handleDeviceOrientation = (e) => {
        if (e.beta === null || e.gamma === null) return;
        // gamma: trái/phải (-90 đến 90), beta: trước/sau (-180 đến 180)
        const tiltY = Math.min(Math.max(e.gamma * 0.7, -22), 22);
        const tiltX = Math.min(Math.max((e.beta - 45) * 0.5, -22), 22);

        const glareX = 50 + (tiltY / 22) * 40;
        const glareY = 50 + (tiltX / 22) * 40;

        setRotation({ x: -tiltX, y: tiltY });
        setGlarePos({ x: glareX, y: glareY, opacity: 0.55 });
      };

      if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission !== "function") {
        window.addEventListener("deviceorientation", handleDeviceOrientation, { passive: true });
      }

      return () => {
        window.removeEventListener("deviceorientation", handleDeviceOrientation);
      };
    }
  }, []);

  // 1. Xử lý chuột trên Desktop (Mouse Move)
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotY = ((x - centerX) / centerX) * 22;
    const rotX = -((y - centerY) / centerY) * 22;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotation({ x: rotX, y: rotY });
    setGlarePos({ x: glareX, y: glareY, opacity: 0.65 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 8, y: -15 });
    setGlarePos({ x: 50, y: 50, opacity: 0.25 });
  };

  // 2. Xử lý vuốt chạm trên Điện thoại (Touch Handlers)
  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    touchStartPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    hasMovedRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || !e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();

    const diffX = touch.clientX - touchStartPos.current.x;
    const diffY = touch.clientY - touchStartPos.current.y;

    if (Math.abs(diffX) > 6 || Math.abs(diffY) > 6) {
      hasMovedRef.current = true;
    }

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotY = Math.min(Math.max(((x - centerX) / centerX) * 25, -24), 24);
    const rotX = Math.min(Math.max(-((y - centerY) / centerY) * 25, -24), 24);

    const glareX = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    const glareY = Math.min(Math.max((y / rect.height) * 100, 0), 100);

    setRotation({ x: rotX, y: rotY });
    setGlarePos({ x: glareX, y: glareY, opacity: 0.7 });
  };

  const handleTouchEnd = () => {
    // Nếu chỉ chạm nhẹ (tap) mà không kéo vuốt -> Lật thẻ
    if (!hasMovedRef.current) {
      setIsFlipped((prev) => !prev);
    }
  };

  const handleClick = () => {
    if (!isTouchDevice) {
      setIsFlipped((prev) => !prev);
    }
  };

  return (
    <div className="card-3d-showcase">
      {/* Khung tương tác xoay 3D chính */}
      <div
        ref={containerRef}
        className="card-3d-stage"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        title={isVi ? "Chạm vào thẻ để lật 2 mặt" : "Tap card to flip"}
      >
        {/* Vòng hào quang phát sáng phía sau */}
        <div
          className="card-3d-glow"
          style={{
            background: `radial-gradient(circle, ${HANOI_CARD.accentColor}44 0%, transparent 70%)`,
          }}
        />

        {/* Thẻ 3D có thể lật và xoay */}
        <div
          className={`card-3d-flipper ${isFlipped ? "is-flipped" : ""}`}
          style={{
            transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y + (isFlipped ? 180 : 0)}deg)`,
          }}
        >
          {/* ══════ MẶT TRƯỚC (FRONT) ══════ */}
          <div className="card-3d-face card-3d-face--front has-real-image">
            <img
              src={HANOI_CARD.frontImage}
              alt="Hà Nội Front"
              className="card-3d-real-img"
            />
            {/* Lớp phản quang Hologram bóng bẩy phủ lên trên ảnh */}
            <div
              className="card-3d-glare"
              style={{
                background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}) 0%, rgba(255,255,255,0.08) 45%, transparent 70%)`,
              }}
            />
          </div>

          {/* ══════ MẶT SAU (BACK) ══════ */}
          <div className="card-3d-face card-3d-face--back has-real-image">
            <img
              src={HANOI_CARD.backImage}
              alt="Hà Nội Back"
              className="card-3d-real-img"
            />
            {/* Lớp phản quang Hologram bóng bẩy phủ lên mặt sau */}
            <div
              className="card-3d-glare"
              style={{
                background: `radial-gradient(circle at ${100 - glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}) 0%, rgba(255,255,255,0.08) 45%, transparent 70%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Hướng dẫn tương tác thích ứng Touch / Desktop */}
      <div className="card-3d-controls">
        <span className="card-3d-hint">
          <Sparkles size={13} />
          {isTouchDevice
            ? (isVi ? "Vuốt để xoay 3D • Chạm để lật thẻ" : "Drag to rotate 3D • Tap to flip")
            : (isVi ? "Rê chuột để xoay 3D • Nhấp vào thẻ để lật" : "Move mouse to rotate 3D • Click card to flip")}
        </span>
      </div>
    </div>
  );
}
