"use client";

import { CheckCircle2, Clock, Package, Truck, PartyPopper, XCircle, AlertTriangle } from "lucide-react";

export default function OrderStepper({ order }) {
  const { status, cancel_request_status, payment_method } = order;

  // ❌ Nếu đơn đã hủy
  if (status === "cancelled") {
    return (
      <div className="order-stepper-box is-cancelled">
        <div className="stepper-cancelled-alert">
          <div className="cancelled-icon-wrap">
            <XCircle size={26} />
          </div>
          <div className="cancelled-info">
            <h3 className="cancelled-title">Đơn hàng đã được hủy</h3>
            <p className="cancelled-desc">
              {order.cancel_reason
                ? `Lý do: "${order.cancel_reason}"`
                : "Đơn hàng đã được đóng lại và voucher hoàn lại ví."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ⚠️ Nếu đơn đang yêu cầu hủy chờ duyệt
  if (cancel_request_status === "pending") {
    return (
      <div className="order-stepper-box is-pending-cancel">
        <div className="stepper-cancelled-alert warning">
          <div className="cancelled-icon-wrap warning">
            <AlertTriangle size={26} />
          </div>
          <div className="cancelled-info">
            <h3 className="cancelled-title">Đang chờ Admin duyệt yêu cầu hủy đơn</h3>
            <p className="cancelled-desc">
              Admin đang kiểm tra tiến độ gia công xưởng mộc và hoàn tiền qua STK: <strong>{order.cancel_bank_info || "của bạn"}</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Các bước chuẩn
  // Bước 1: Đã đặt hàng
  // Bước 2: Xưởng chuẩn bị
  // Bước 3: Đang trung chuyển
  // Bước 4: Đã giao hàng

  let currentStep = 1;
  if (status === "pending" || status === "paid") {
    currentStep = 2; // Đang ở xưởng chuẩn bị
  }
  if (status === "shipping") {
    currentStep = 3; // Đang trung chuyển
  }
  if (status === "completed") {
    currentStep = 4; // Hoàn tất
  }

  const steps = [
    {
      step: 1,
      title: "Đã đặt hàng",
      subtext: "Hệ thống ghi nhận",
      icon: Clock,
    },
    {
      step: 2,
      title: "Xưởng chuẩn bị",
      subtext: "Chế tác laser & NFC",
      icon: Package,
    },
    {
      step: 3,
      title: "Đang trung chuyển",
      subtext: "Bàn giao bưu cục",
      icon: Truck,
    },
    {
      step: 4,
      title: "Đã giao đơn hàng",
      subtext: "Nhận hàng & kích hoạt",
      icon: PartyPopper,
    },
  ];

  return (
    <div className="order-stepper-box">
      <div className="stepper-track-container">
        {/* Progress Fill Line */}
        <div
          className="stepper-progress-fill"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((s) => {
          const isCompleted = currentStep >= s.step;
          const isCurrent = currentStep === s.step;
          const IconComp = s.icon;

          return (
            <div
              key={s.step}
              className={`stepper-node ${isCompleted ? "is-completed" : ""} ${isCurrent ? "is-current" : ""}`}
            >
              <div className="stepper-circle-icon">
                {isCompleted && !isCurrent ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <IconComp size={16} />
                )}
              </div>
              <div className="stepper-label-box">
                <span className="stepper-title">{s.title}</span>
                <span className="stepper-subtext">{s.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
