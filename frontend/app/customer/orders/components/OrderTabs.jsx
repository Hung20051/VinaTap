"use client";

import { useRef, useState } from "react";

export default function OrderTabs({ filterStatus, setFilterStatus, orders }) {
  const tabsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const tabs = [
    {
      id: "all",
      label: "✨ Tất cả",
      count: orders.length,
    },
    {
      id: "preparing",
      label: "📦 Đang chuẩn bị",
      count: orders.filter(
        (o) =>
          (o.status === "paid" && o.cancel_request_status !== "pending") ||
          (o.payment_method === "cod" && o.status === "pending"),
      ).length,
    },
    {
      id: "shipping",
      label: "🚚 Đang giao hàng",
      count: orders.filter((o) => o.status === "shipping").length,
    },
    {
      id: "cancel_request",
      label: "⚠️ Yêu cầu hủy",
      count: orders.filter((o) => o.cancel_request_status === "pending").length,
    },
    {
      id: "completed",
      label: "🎉 Đã hoàn tất",
      count: orders.filter((o) => o.status === "completed").length,
    },
    {
      id: "cancelled",
      label: "❌ Đã hủy",
      count: orders.filter((o) => o.status === "cancelled").length,
    },
  ];

  // 🖱️ Hỗ trợ kéo chuột trái qua lại trên máy tính (Drag-to-Scroll)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - tabsRef.current.offsetLeft);
    setScrollLeft(tabsRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Tốc độ lướt
    if (Math.abs(x - startX) > 4) {
      setHasMoved(true);
    }
    tabsRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 🔄 Hỗ trợ lăn con lăn chuột cuộn ngang (Wheel scroll)
  const handleWheel = (e) => {
    if (tabsRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        tabsRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  return (
    <div
      ref={tabsRef}
      className={`cust-orders-tabs-carousel ${isDragging ? "is-dragging" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`cust-tab-pill ${filterStatus === tab.id ? "is-active" : ""}`}
          onClick={() => {
            if (!hasMoved) {
              setFilterStatus(tab.id);
            }
          }}
        >
          <span>{tab.label}</span>
          <span className="tab-count-badge">{tab.count}</span>
        </button>
      ))}
    </div>
  );
}
